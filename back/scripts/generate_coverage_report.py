#!/usr/bin/env python3
"""
Génère un rapport de couverture en Markdown en français à partir des données JaCoCo
"""

import os
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple


def format_percentage(value: float) -> str:
    """Formate un pourcentage avec 2 décimales."""
    if value is None or value != value:  # Check for NaN
        return 'N/A'
    return f"{value:.2f}%"


def format_coverage_badge(percentage: float) -> str:
    """Retourne un badge selon le pourcentage de couverture."""
    if percentage >= 90:
        return '🟢'
    elif percentage >= 80:
        return '🟡'
    elif percentage >= 75:
        return '🟠'
    else:
        return '🔴'


def calculate_percentage(covered: int, missed: int) -> float:
    """Calcule le pourcentage de couverture."""
    total = covered + missed
    if total == 0:
        return 0.0
    return (covered / total) * 100.0


def parse_counter(counter_elem) -> Optional[Dict[str, int]]:
    """Parse un élément counter JaCoCo."""
    if counter_elem is None:
        return None
    return {
        'type': counter_elem.get('type', ''),
        'missed': int(counter_elem.get('missed', 0)),
        'covered': int(counter_elem.get('covered', 0)),
    }


def extract_global_stats(report_root) -> Dict:
    """Extrait les statistiques globales du rapport JaCoCo."""
    stats = {
        'instruction': {'missed': 0, 'covered': 0, 'percentage': 0.0},
        'branch': {'missed': 0, 'covered': 0, 'percentage': 0.0},
        'line': {'missed': 0, 'covered': 0, 'percentage': 0.0},
        'method': {'missed': 0, 'covered': 0, 'percentage': 0.0},
        'class': {'missed': 0, 'covered': 0, 'percentage': 0.0},
    }

    # Extract counters from report root
    for counter in report_root.findall('counter'):
        counter_data = parse_counter(counter)
        if counter_data:
            counter_type = counter_data['type'].lower()
            if counter_type == 'instruction':
                stats['instruction'] = {
                    'missed': counter_data['missed'],
                    'covered': counter_data['covered'],
                    'percentage': calculate_percentage(counter_data['covered'], counter_data['missed']),
                }
            elif counter_type == 'branch':
                stats['branch'] = {
                    'missed': counter_data['missed'],
                    'covered': counter_data['covered'],
                    'percentage': calculate_percentage(counter_data['covered'], counter_data['missed']),
                }
            elif counter_type == 'line':
                stats['line'] = {
                    'missed': counter_data['missed'],
                    'covered': counter_data['covered'],
                    'percentage': calculate_percentage(counter_data['covered'], counter_data['missed']),
                }
            elif counter_type == 'method':
                stats['method'] = {
                    'missed': counter_data['missed'],
                    'covered': counter_data['covered'],
                    'percentage': calculate_percentage(counter_data['covered'], counter_data['missed']),
                }
            elif counter_type == 'class':
                stats['class'] = {
                    'missed': counter_data['missed'],
                    'covered': counter_data['covered'],
                    'percentage': calculate_percentage(counter_data['covered'], counter_data['missed']),
                }

    return stats


def extract_package_stats(package_elem) -> Dict:
    """Extrait les statistiques d'un package."""
    package_name = package_elem.get('name', '')
    
    stats = {
        'name': package_name,
        'instruction': {'missed': 0, 'covered': 0, 'percentage': 0.0},
        'branch': {'missed': 0, 'covered': 0, 'percentage': 0.0},
        'line': {'missed': 0, 'covered': 0, 'percentage': 0.0},
        'method': {'missed': 0, 'covered': 0, 'percentage': 0.0},
        'class': {'missed': 0, 'covered': 0, 'percentage': 0.0},
    }

    # Extract counters from package
    for counter in package_elem.findall('counter'):
        counter_data = parse_counter(counter)
        if counter_data:
            counter_type = counter_data['type'].lower()
            if counter_type == 'instruction':
                stats['instruction'] = {
                    'missed': counter_data['missed'],
                    'covered': counter_data['covered'],
                    'percentage': calculate_percentage(counter_data['covered'], counter_data['missed']),
                }
            elif counter_type == 'branch':
                stats['branch'] = {
                    'missed': counter_data['missed'],
                    'covered': counter_data['covered'],
                    'percentage': calculate_percentage(counter_data['covered'], counter_data['missed']),
                }
            elif counter_type == 'line':
                stats['line'] = {
                    'missed': counter_data['missed'],
                    'covered': counter_data['covered'],
                    'percentage': calculate_percentage(counter_data['covered'], counter_data['missed']),
                }
            elif counter_type == 'method':
                stats['method'] = {
                    'missed': counter_data['missed'],
                    'covered': counter_data['covered'],
                    'percentage': calculate_percentage(counter_data['covered'], counter_data['missed']),
                }
            elif counter_type == 'class':
                stats['class'] = {
                    'missed': counter_data['missed'],
                    'covered': counter_data['covered'],
                    'percentage': calculate_percentage(counter_data['covered'], counter_data['missed']),
                }

    return stats


def generate_unit_test_report(surefire_reports_path: Path) -> Optional[Dict]:
    """Génère un rapport des tests unitaires depuis les rapports Surefire."""
    if not surefire_reports_path.exists():
        return None

    report_files = list(surefire_reports_path.glob('TEST-*.xml'))
    
    total_tests = 0
    total_errors = 0
    total_failures = 0
    total_skipped = 0
    test_suites = []

    for report_file in report_files:
        try:
            tree = ET.parse(report_file)
            root = tree.getroot()
            
            # Handle both testsuite and testsuites root elements
            if root.tag == 'testsuites':
                for testsuite in root.findall('testsuite'):
                    suite_name = testsuite.get('name', report_file.stem)
                    tests = int(testsuite.get('tests', 0))
                    errors = int(testsuite.get('errors', 0))
                    failures = int(testsuite.get('failures', 0))
                    skipped = int(testsuite.get('skipped', 0))
                    
                    total_tests += tests
                    total_errors += errors
                    total_failures += failures
                    total_skipped += skipped
                    
                    test_suites.append({
                        'name': suite_name,
                        'tests': tests,
                        'errors': errors,
                        'failures': failures,
                        'skipped': skipped,
                    })
            elif root.tag == 'testsuite':
                suite_name = root.get('name', report_file.stem)
                tests = int(root.get('tests', 0))
                errors = int(root.get('errors', 0))
                failures = int(root.get('failures', 0))
                skipped = int(root.get('skipped', 0))
                
                total_tests += tests
                total_errors += errors
                total_failures += failures
                total_skipped += skipped
                
                test_suites.append({
                    'name': suite_name,
                    'tests': tests,
                    'errors': errors,
                    'failures': failures,
                    'skipped': skipped,
                })
        except Exception as e:
            print(f"⚠️  Erreur lors de la lecture de {report_file}: {e}", file=sys.stderr)

    return {
        'totalTests': total_tests,
        'totalErrors': total_errors,
        'totalFailures': total_failures,
        'totalSkipped': total_skipped,
        'testSuites': test_suites,
    }


def generate_e2e_test_report(failsafe_reports_path: Path) -> Optional[Dict]:
    """Génère un rapport des tests d'intégration depuis les rapports Failsafe."""
    summary_path = failsafe_reports_path / 'failsafe-summary.xml'
    
    if not summary_path.exists():
        return None

    try:
        tree = ET.parse(summary_path)
        root = tree.getroot()
        
        if root.tag == 'failsafe-summary':
            return {
                'completed': int(root.findtext('completed', '0')),
                'errors': int(root.findtext('errors', '0')),
                'failures': int(root.findtext('failures', '0')),
                'skipped': int(root.findtext('skipped', '0')),
            }
    except Exception as e:
        print(f"⚠️  Erreur lors de la lecture du résumé Failsafe: {e}", file=sys.stderr)

    # Fallback: count test files
    test_files = list(failsafe_reports_path.glob('TEST-*.xml'))
    return {
        'completed': len(test_files),
        'errors': 0,
        'failures': 0,
        'skipped': 0,
    }


def main():
    """Fonction principale."""
    root_dir = Path(__file__).parent.parent
    jacoco_xml_path = root_dir / 'target' / 'site' / 'jacoco' / 'jacoco.xml'
    surefire_reports_path = root_dir / 'target' / 'surefire-reports'
    failsafe_reports_path = root_dir / 'target' / 'failsafe-reports'
    output_path = root_dir / 'RAPPORT_COUVERTURE.md'

    if not jacoco_xml_path.exists():
        print(f"❌ Fichier JaCoCo non trouvé: {jacoco_xml_path}", file=sys.stderr)
        print("   Exécutez d'abord: mvn clean verify jacoco:report", file=sys.stderr)
        sys.exit(1)

    print('📊 Analyse des données JaCoCo...')
    
    try:
        tree = ET.parse(jacoco_xml_path)
        root = tree.getroot()
    except Exception as e:
        print(f"❌ Erreur lors de la lecture du XML JaCoCo: {e}", file=sys.stderr)
        sys.exit(1)

    if root.tag != 'report':
        print('❌ Format JaCoCo XML invalide', file=sys.stderr)
        sys.exit(1)

    # Extract global stats
    global_stats = extract_global_stats(root)

    # Extract package stats
    packages = root.findall('package')
    package_stats = [extract_package_stats(pkg) for pkg in packages]
    
    # Sort packages by instruction coverage (descending)
    package_stats.sort(key=lambda x: x['instruction']['percentage'], reverse=True)

    # Generate unit test report
    unit_test_report = generate_unit_test_report(surefire_reports_path)

    # Generate E2E test report
    e2e_test_report = generate_e2e_test_report(failsafe_reports_path)

    # Generate Markdown report
    now = datetime.now()
    date_str = now.strftime('%d/%m/%Y %H:%M:%S')

    markdown = f"""# Rapport de Couverture des Tests

**Projet**: MDD API (Backend)
**Date**: {date_str}

---

## Tests Unitaires

**Date de génération**: {date_str}

### Statistiques Globales

| Métrique | Couvert | Total | Pourcentage |
|----------|---------|-------|-------------|
| Instructions | {global_stats['instruction']['covered']} | {global_stats['instruction']['covered'] + global_stats['instruction']['missed']} | {format_coverage_badge(global_stats['instruction']['percentage'])} {format_percentage(global_stats['instruction']['percentage'])} |
| Lignes | {global_stats['line']['covered']} | {global_stats['line']['covered'] + global_stats['line']['missed']} | {format_coverage_badge(global_stats['line']['percentage'])} {format_percentage(global_stats['line']['percentage'])} |
| Branches | {global_stats['branch']['covered']} | {global_stats['branch']['covered'] + global_stats['branch']['missed']} | {format_coverage_badge(global_stats['branch']['percentage'])} {format_percentage(global_stats['branch']['percentage'])} |
| Méthodes | {global_stats['method']['covered']} | {global_stats['method']['covered'] + global_stats['method']['missed']} | {format_coverage_badge(global_stats['method']['percentage'])} {format_percentage(global_stats['method']['percentage'])} |
| Classes | {global_stats['class']['covered']} | {global_stats['class']['covered'] + global_stats['class']['missed']} | {format_coverage_badge(global_stats['class']['percentage'])} {format_percentage(global_stats['class']['percentage'])} |

### Couverture par Paquet

| Paquet | Instructions | Lignes | Branches | Méthodes | Classes |
|--------|--------------|--------|----------|----------|---------|
"""

    for pkg in package_stats:
        package_name = pkg['name'].replace('/', '.').lstrip('.') or '(racine)'
        markdown += f"| `{package_name}` | {format_coverage_badge(pkg['instruction']['percentage'])} {format_percentage(pkg['instruction']['percentage'])} | {format_coverage_badge(pkg['line']['percentage'])} {format_percentage(pkg['line']['percentage'])} | {format_coverage_badge(pkg['branch']['percentage'])} {format_percentage(pkg['branch']['percentage'])} | {format_coverage_badge(pkg['method']['percentage'])} {format_percentage(pkg['method']['percentage'])} | {format_coverage_badge(pkg['class']['percentage'])} {format_percentage(pkg['class']['percentage'])} |\n"

    markdown += f"\n**Total de paquets**: {len(package_stats)}\n\n"

    # Unit test statistics
    if unit_test_report:
        markdown += f"""### Informations sur les Tests Unitaires

- **Fichiers de test**: {len(unit_test_report['testSuites'])}
- **Tests unitaires**: {unit_test_report['totalTests']}
- **Erreurs**: {unit_test_report['totalErrors']}
- **Échecs**: {unit_test_report['totalFailures']}
- **Ignorés**: {unit_test_report['totalSkipped']}

"""

    markdown += """---

## Tests d'Intégration (E2E)

**Date de génération**: """ + date_str + "\n\n"

    if e2e_test_report:
        markdown += f"""### Statistiques Globales

| Métrique | Valeur |
|----------|--------|
| Tests complétés | {e2e_test_report['completed']} |
| Erreurs | {e2e_test_report['errors']} |
| Échecs | {e2e_test_report['failures']} |
| Ignorés | {e2e_test_report['skipped']} |

"""
    else:
        markdown += "⚠️ Aucun rapport de tests d'intégration trouvé.\n\n"

    markdown += """---

## Résumé

### Tests Unitaires

- **Couverture globale**: """ + format_coverage_badge(global_stats['instruction']['percentage']) + " " + format_percentage(global_stats['instruction']['percentage']) + f"""
  - Instructions: {format_percentage(global_stats['instruction']['percentage'])} ({global_stats['instruction']['covered']}/{global_stats['instruction']['covered'] + global_stats['instruction']['missed']})
  - Lignes: {format_percentage(global_stats['line']['percentage'])} ({global_stats['line']['covered']}/{global_stats['line']['covered'] + global_stats['line']['missed']})
  - Branches: {format_percentage(global_stats['branch']['percentage'])} ({global_stats['branch']['covered']}/{global_stats['branch']['covered'] + global_stats['branch']['missed']})
  - Méthodes: {format_percentage(global_stats['method']['percentage'])} ({global_stats['method']['covered']}/{global_stats['method']['covered'] + global_stats['method']['missed']})
  - Classes: {format_percentage(global_stats['class']['percentage'])} ({global_stats['class']['covered']}/{global_stats['class']['covered'] + global_stats['class']['missed']})

"""

    if e2e_test_report:
        markdown += f"""### Tests d'Intégration (E2E)

- **Tests complétés**: {e2e_test_report['completed']}
- **Erreurs**: {e2e_test_report['errors']}
- **Échecs**: {e2e_test_report['failures']}
- **Ignorés**: {e2e_test_report['skipped']}

"""

    markdown += """---

## Rapport HTML

Le rapport HTML détaillé est disponible à :
```
target/site/jacoco/index.html
```

Vous pouvez l'ouvrir dans votre navigateur pour voir :
- Couverture ligne par ligne
- Détails de couverture des branches
- Couverture des méthodes
- Lignes non couvertes mises en évidence
"""

    # Write report
    output_path.write_text(markdown, encoding='utf-8')
    print(f"✅ Rapport généré: {output_path}")


if __name__ == '__main__':
    main()
