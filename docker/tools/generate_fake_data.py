#!/usr/bin/env python3
"""
Generate realistic fake data for the MDD application database.

Generates:
- 15 users
- Each user subscribes to 2-7 topics (random)
- For each topic: 10-20 articles (random) from different users
- For each article: 0-5 comments (random) from random users

Usage:
    # Using the wrapper script (recommended - handles virtual environment):
    ./docker/tools/generate_fake_data.sh
    
    # Or manually with virtual environment:
    source docker/tools/.venv/bin/activate
    python3 docker/tools/generate_fake_data.py
"""

import os
import sys
import random
import json
import time
import unicodedata
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Tuple, Dict

try:
    import mysql.connector
    from mysql.connector import Error
    from faker import Faker
    import requests
except ImportError as e:
    print(f"Erreur : Bibliothèque requise manquante : {e}")
    print("Installez-les avec : pip install mysql-connector-python faker requests")
    sys.exit(1)

# Add project root to path
ROOT_DIR = Path(__file__).parent.parent.parent
sys.path.insert(0, str(ROOT_DIR))

# Initialize Faker with French locale
fake = Faker('fr_FR')


def load_env_file(env_path: Path) -> dict:
    """Load environment variables from .env file."""
    env_vars = {}
    if not env_path.exists():
        print(f"Warning: .env file not found at {env_path}")
        return env_vars
    
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                key, value = line.split('=', 1)
                env_vars[key.strip()] = value.strip().strip('"').strip("'")
    
    return env_vars


def register_user_via_api(api_url: str, username: str, email: str, password: str) -> bool:
    """Register a user via the API endpoint."""
    url = f"{api_url}/auth/register"
    payload = {
        "username": username,
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        if response.status_code == 201:
            # Small delay to ensure database transaction is committed
            time.sleep(0.1)
            return True
        else:
            print(f"    ⚠️  Erreur API pour {username}: {response.status_code} - {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"    ⚠️  Erreur de connexion API pour {username}: {e}")
        return False


def get_db_connection(env_vars: dict) -> mysql.connector.MySQLConnection:
    """Create database connection from environment variables."""
    # Parse MYSQL_DB_URL if present, otherwise use individual vars
    db_url = env_vars.get('MYSQL_DB_URL', '')
    
    if db_url and db_url.startswith('jdbc:mysql://'):
        # Parse jdbc:mysql://host:port/database
        url_part = db_url.replace('jdbc:mysql://', '')
        if '/' in url_part:
            host_port, database = url_part.split('/', 1)
            if ':' in host_port:
                host, port = host_port.split(':')
            else:
                host, port = host_port, '3306'
        else:
            host, port, database = '127.0.0.1', '3306', 'mddapp'
    else:
        host = env_vars.get('MYSQL_HOST', '127.0.0.1')
        port = env_vars.get('MYSQL_PORT', '3306')
        database = env_vars.get('MYSQL_DATABASE', 'mddapp')
    
    # If host is 'db' (Docker service name), replace with localhost
    # since this script runs from the host machine, not inside Docker
    if host == 'db':
        print("⚠️  Nom de service Docker 'db' détecté dans l'URL de connexion.")
        print("   Remplacement par '127.0.0.1' pour la connexion hôte...")
        host = '127.0.0.1'
    
    user = env_vars.get('MYSQL_USER', 'mdduser')
    password = env_vars.get('MYSQL_PASSWORD', 'mddpassword')
    
    print(f"   Connexion à : {user}@{host}:{port}/{database}")
    
    try:
        connection = mysql.connector.connect(
            host=host,
            port=int(port),
            database=database,
            user=user,
            password=password
        )
        return connection
    except Error as e:
        print(f"Erreur de connexion à MySQL : {e}")
        print(f"\n💡 Astuce : Assurez-vous que la base de données est en cours d'exécution et accessible à {host}:{port}")
        print(f"   Si vous utilisez Docker : docker-compose up -d db")
        sys.exit(1)


# Realistic data generators using Faker
# Faker is initialized with French locale above

# Realistic data generators using Faker
# Faker is initialized with French locale above

COMMENT_TEMPLATES = [
    "Excellent article ! Cela m'a vraiment aidé à mieux comprendre le concept.",
    "Merci pour le partage. Je lutte avec cela depuis un moment.",
    "Explication excellente. Pourriez-vous fournir plus d'exemples ?",
    "Je ne suis pas d'accord avec le point 3. Dans mon expérience, cela fonctionne différemment.",
    "C'est exactement ce que je cherchais. Très utile !",
    "Belle rédaction. Je vais certainement essayer cette approche.",
    "J'ai une question sur l'implémentation. Comment gérez-vous les cas limites ?",
    "Bien écrit et facile à suivre. Merci !",
    "J'ai essayé cela auparavant mais j'ai rencontré des problèmes. Des suggestions ?",
    "Bon aperçu, mais je pense que vous avez manqué un aspect important.",
    "Timing parfait ! J'étais sur le point d'implémenter cela.",
    "Clair et concis. J'apprécie les exemples pratiques.",
    "J'utilisais une approche différente, mais celle-ci semble meilleure.",
    "Pourriez-vous élaborer sur les implications de performance ?",
    "Merci pour l'explication détaillée. Très informatif !"
]


def normalize_to_ascii(text: str) -> str:
    """Remove accents and special characters, convert to ASCII."""
    # Normalize to NFD (decomposed form) and remove combining characters (accents)
    normalized = unicodedata.normalize('NFD', text)
    # Remove combining characters (accents)
    ascii_text = ''.join(char for char in normalized if unicodedata.category(char) != 'Mn')
    return ascii_text


def generate_username(first_name: str, last_name: str, index: int) -> str:
    """Generate a unique username without French accents."""
    # Remove accents from names
    first_name_clean = normalize_to_ascii(first_name).lower()
    last_name_clean = normalize_to_ascii(last_name).lower()
    
    base = f"{first_name_clean}.{last_name_clean}"
    if index > 0:
        base += str(index)
    return base


def generate_email(username: str) -> str:
    """Generate email using Faker."""
    return fake.email()


def generate_article_title(topic_name: str) -> str:
    """Generate a realistic article title for a topic using Faker."""
    # Generate a sentence and make it title-like
    sentence = fake.sentence(nb_words=random.randint(4, 8))
    # Remove period and capitalize
    title = sentence.rstrip('.').capitalize()
    # Add topic name for context
    if random.random() > 0.3:  # 70% chance to include topic
        title = f"{title} - {topic_name}"
    return title


def generate_article_content() -> str:
    """Generate realistic article content using Faker."""
    # Generate multiple paragraphs of French text
    paragraphs = []
    for _ in range(random.randint(4, 8)):
        paragraphs.append(fake.paragraph(nb_sentences=random.randint(4, 10)))
    
    content = "\n\n".join(paragraphs)
    
    # Ensure it fits in varchar(10000)
    return content[:10000]


def generate_comment() -> str:
    """Generate a realistic comment using Faker or templates."""
    # Mix Faker-generated comments with templates for variety
    if random.random() > 0.5:
        # Use Faker to generate French sentences
        return fake.sentence(nb_words=random.randint(8, 20))
    else:
        return random.choice(COMMENT_TEMPLATES)


def save_user_credentials(users_data: List[Dict], output_dir: Path):
    """Save user credentials to JSON file."""
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Save as JSON
    json_file = output_dir / "users_credentials.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(users_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n💾 Identifiants utilisateurs enregistrés dans :")
    print(f"   - {json_file}")


def generate_users(api_url: str, connection, cursor, count: int = 15) -> Tuple[List[int], List[Dict]]:
    """Generate users via API and return their IDs and credentials."""
    print(f"\n📝 Génération de {count} utilisateurs via l'API...")
    user_ids = []
    users_data = []
    
    used_usernames = set()
    used_emails = set()
    # Password must meet requirements: min 8 chars, digit, lowercase, uppercase, special char
    plain_password = "Password123!"
    
    for i in range(count):
        # Use Faker to generate French names
        first_name = fake.first_name()
        last_name = fake.last_name()
        
        # Generate unique username
        username = generate_username(first_name, last_name, 0)
        counter = 1
        while username in used_usernames:
            username = generate_username(first_name, last_name, counter)
            counter += 1
        used_usernames.add(username)
        
        # Generate unique email using Faker
        email = fake.unique.email()
        used_emails.add(email)
        
        # Register user via API
        if register_user_via_api(api_url, username, email, plain_password):
            # Get user ID from database after registration
            # Commit any pending transaction to see changes from API
            connection.commit()
            
            # Try multiple times with retries in case of transaction delay
            user_id = None
            max_retries = 5
            for retry in range(max_retries):
                try:
                    # Use LOWER() for case-insensitive comparison
                    cursor.execute(
                        "SELECT id FROM users WHERE LOWER(username) = LOWER(%s) OR LOWER(email) = LOWER(%s) LIMIT 1",
                        (username, email)
                    )
                    result = cursor.fetchone()
                    if result:
                        user_id = result[0]
                        break
                    else:
                        # Wait a bit longer before retrying
                        if retry < max_retries - 1:
                            time.sleep(0.3)
                            # Commit again to refresh view
                            connection.commit()
                except Error as e:
                    print(f"  ⚠️  Erreur lors de la récupération de l'ID pour {username} : {e}")
                    break
            
            if user_id:
                user_ids.append(user_id)
                
                # Store credentials for file export
                users_data.append({
                    'id': user_id,
                    'username': username,
                    'email': email,
                    'password': plain_password
                })
                
                print(f"  ✓ Utilisateur créé : {username} ({email})")
            else:
                print(f"  ⚠️  Utilisateur {username} créé mais ID non trouvé dans la base de données après {max_retries} tentatives")
                # Try one more time with a direct query to debug
                try:
                    cursor.execute("SELECT id, username, email FROM users WHERE username LIKE %s OR email LIKE %s", 
                                  (f"%{username}%", f"%{email}%"))
                    debug_results = cursor.fetchall()
                    if debug_results:
                        print(f"    🔍 Debug: Trouvé {len(debug_results)} utilisateur(s) similaire(s) dans la base")
                except:
                    pass
        else:
            print(f"  ✗ Échec de la création de l'utilisateur {username}")
    
    return user_ids, users_data


def get_topic_ids(cursor) -> List[int]:
    """Get all topic IDs from database."""
    cursor.execute("SELECT id, name FROM topics ORDER BY id")
    topics = cursor.fetchall()
    topic_ids = [topic[0] for topic in topics]
    print(f"\n📚 {len(topic_ids)} sujets trouvés : {[topic[1] for topic in topics]}")
    return topic_ids


def generate_user_subscriptions(cursor, user_ids: List[int], topic_ids: List[int]):
    """Generate user-topic subscriptions (2-7 topics per user)."""
    print(f"\n🔔 Génération des abonnements utilisateurs...")
    
    for user_id in user_ids:
        num_subscriptions = random.randint(2, min(7, len(topic_ids)))
        subscribed_topics = random.sample(topic_ids, num_subscriptions)
        
        for topic_id in subscribed_topics:
            try:
                cursor.execute(
                    "INSERT INTO user_topics (user_id, topic_id) VALUES (%s, %s)",
                    (user_id, topic_id)
                )
            except Error as e:
                # Ignore duplicate key errors
                if "Duplicate entry" not in str(e):
                    print(f"  ✗ Erreur lors de l'abonnement de l'utilisateur {user_id} au sujet {topic_id} : {e}")
        
        print(f"  ✓ Utilisateur {user_id} abonné à {num_subscriptions} sujets")


def generate_articles(cursor, user_ids: List[int], topic_ids: List[int]):
    """Generate articles for each topic (10-20 per topic)."""
    print(f"\n📄 Génération des articles...")
    
    cursor.execute("SELECT id, name FROM topics ORDER BY id")
    topics = cursor.fetchall()
    
    total_articles = 0
    
    for topic_id, topic_name in topics:
        num_articles = random.randint(10, 20)
        print(f"\n  Sujet : {topic_name} ({num_articles} articles)")
        
        for i in range(num_articles):
            author_id = random.choice(user_ids)
            title = generate_article_title(topic_name)
            content = generate_article_content()
            
            # Random creation date within last 3 months
            days_ago = random.randint(0, 90)
            created_at = datetime.now() - timedelta(days=days_ago)
            
            # Some articles have updates
            updated_at = None
            if random.random() > 0.7:
                days_after = random.randint(1, 30)
                updated_at = created_at + timedelta(days=days_after)
            
            try:
                cursor.execute(
                    """INSERT INTO articles (title, content, author_id, topic_id, created_at, updated_at)
                       VALUES (%s, %s, %s, %s, %s, %s)""",
                    (title, content, author_id, topic_id, created_at, updated_at)
                )
                total_articles += 1
                if (i + 1) % 5 == 0:
                    print(f"    ✓ {i + 1}/{num_articles} articles créés")
            except Error as e:
                print(f"    ✗ Erreur lors de la création de l'article : {e}")
    
    print(f"\n  ✓ Total d'articles créés : {total_articles}")


def generate_comments(cursor, user_ids: List[int]):
    """Generate comments for articles (0-5 per article)."""
    print(f"\n💬 Génération des commentaires...")
    
    cursor.execute("SELECT id FROM articles ORDER BY id")
    article_ids = [row[0] for row in cursor.fetchall()]
    
    total_comments = 0
    
    for article_id in article_ids:
        num_comments = random.randint(0, 5)
        
        if num_comments == 0:
            continue
        
        # Get article creation date
        cursor.execute("SELECT created_at FROM articles WHERE id = %s", (article_id,))
        article_created = cursor.fetchone()[0]
        
        for i in range(num_comments):
            author_id = random.choice(user_ids)
            content = generate_comment()
            
            # Comment created after article, within 30 days
            days_after = random.randint(1, 30)
            created_at = article_created + timedelta(days=days_after)
            
            try:
                cursor.execute(
                    "INSERT INTO comments (content, author_id, article_id, created_at) VALUES (%s, %s, %s, %s)",
                    (content, author_id, article_id, created_at)
                )
                total_comments += 1
            except Error as e:
                print(f"  ✗ Erreur lors de la création du commentaire : {e}")
        
        if total_comments % 50 == 0 and total_comments > 0:
            print(f"  ✓ {total_comments} commentaires créés...")
    
    print(f"\n  ✓ Total de commentaires créés : {total_comments}")


def main():
    """Main function to generate fake data."""
    print("=" * 60)
    print("MDD Application - Générateur de données factices")
    print("=" * 60)
    
    # Load environment variables
    env_path = ROOT_DIR / '.env'
    env_vars = load_env_file(env_path)
    
    if not env_vars:
        print("\n⚠️  Utilisation des valeurs de connexion par défaut")
        print("   (MYSQL_USER=mdduser, MYSQL_PASSWORD=mddpassword, MYSQL_DATABASE=mddapp)")
    
    # Get API URL from environment or use default
    api_url = env_vars.get('API_URL', 'http://localhost/api')
    if not api_url.startswith('http'):
        # If just a path, prepend localhost
        api_url = f"http://localhost{api_url}"
    
    print(f"\n🌐 URL de l'API : {api_url}")
    
    # Connect to database
    print("\n🔌 Connexion à la base de données...")
    connection = get_db_connection(env_vars)
    cursor = connection.cursor()
    
    try:
        # Don't start a transaction yet - we need to see users created by API
        # Set autocommit to see changes from other connections immediately
        connection.autocommit = True
        
        # Generate data
        user_ids, users_data = generate_users(api_url, connection, cursor, count=15)
        
        # Now start transaction for the rest of the operations
        connection.autocommit = False
        connection.start_transaction()
        topic_ids = get_topic_ids(cursor)
        
        if not topic_ids:
            print("\n❌ Erreur : Aucun sujet trouvé dans la base de données !")
            print("   Veuillez vous assurer que les sujets sont créés en premier (ils devraient être dans dump.sql)")
            connection.rollback()
            return
        
        generate_user_subscriptions(cursor, user_ids, topic_ids)
        generate_articles(cursor, user_ids, topic_ids)
        generate_comments(cursor, user_ids)
        
        # Commit transaction
        connection.commit()
        
        # Save user credentials to file
        output_dir = ROOT_DIR / "docker" / "tools" / "generated_data"
        save_user_credentials(users_data, output_dir)
        
        print("\n" + "=" * 60)
        print("✅ Génération de données factices terminée avec succès !")
        print("=" * 60)
        
    except Error as e:
        print(f"\n❌ Erreur lors de la génération de données : {e}")
        connection.rollback()
        print("   Transaction annulée.")
    finally:
        cursor.close()
        connection.close()
        print("\n🔌 Connexion à la base de données fermée.")


if __name__ == '__main__':
    main()
