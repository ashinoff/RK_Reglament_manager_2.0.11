const navigationMaps = {
  'r057-2022': {
    docUrl: '/regulations/r057-2022/source.pdf',
    sections: {
      'normative': { page: 3,  section: '1' },
      'general': { page: 3,  section: '2' },
      'info-activities': { page: 5,  section: '3' },
      'parallel-connection': { page: 6,  section: '4.3' },
      'no-contract-consumption': { page: 8,  section: '4.4' },
      'restriction-control': { page: 9,  section: '4.5' },
      'planning-detection': { page: 10,  section: '4.6' },
      'consumption-analysis': { page: 11,  section: '4.7' },
      'check-preparation': { page: 12, section: '4.8' },
      'conducting-checks': { page: 13, section: '4.9' },
      'calculation-unaccounted': { page: 25, section: '4.10' },
      'calculation-unaccounted-phys': { page: 28, section: '4.11' },
      'contractless-calculation': { page: 31, section: '4.12' },
      'meter-malfunction': { page: 35, section: '4.13' },
      'commission-review': { page: 36, section: '4.14' },
      'damage-compensation': { page: 38, section: '4.15' },
      'cost-recovery': { page: 40, section: '4.16' },
      // при необходимости: поправь нумерацию ниже, если в PDF нет «дыры»
      'law-enforcement': { page: 49, section: '4.17' },   // было 4.18
      'operational-control': { page: 51, section: '4.18' },// было 4.19

      // новые разделы — их нет в исходном PDF, поэтому page=null
      'acts-lifecycle': { page: 18, section: '—' },
      'acts-flow': { page: 23, section: '—' },
      'common-schemes': { page: 22, section: '—' },
    }
  }
};
