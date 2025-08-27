import { SvgProps } from 'react-native-svg';

import ArgentinaIcon from '@/assets/icons/flags/ar.svg';
import AustriaIcon from '@/assets/icons/flags/at.svg';
import AustraliaIcon from '@/assets/icons/flags/au.svg';
import BelgiumIcon from '@/assets/icons/flags/be.svg';
import BrazilIcon from '@/assets/icons/flags/br.svg';
import CanadaIcon from '@/assets/icons/flags/ca.svg';
import SwitzerlandIcon from '@/assets/icons/flags/ch.svg';
import ChileIcon from '@/assets/icons/flags/cl.svg';
import ColombiaIcon from '@/assets/icons/flags/co.svg';
import CyprusIcon from '@/assets/icons/flags/cy.svg';
import GermanyIcon from '@/assets/icons/flags/de.svg';
import EstoniaIcon from '@/assets/icons/flags/ee.svg';
import EgyptIcon from '@/assets/icons/flags/eg.svg';
import SpainIcon from '@/assets/icons/flags/es.svg';
import FinlandIcon from '@/assets/icons/flags/fi.svg';
import FranceIcon from '@/assets/icons/flags/fr.svg';
import UKIcon from '@/assets/icons/flags/gb.svg';
import GreeceIcon from '@/assets/icons/flags/gr.svg';
import GuatemalaIcon from '@/assets/icons/flags/gt.svg';
import CroatiaIcon from '@/assets/icons/flags/hr.svg';
import IrelandIcon from '@/assets/icons/flags/ie.svg';
import ItalyIcon from '@/assets/icons/flags/it.svg';
import JordanIcon from '@/assets/icons/flags/jo.svg';
import JapanIcon from '@/assets/icons/flags/jp.svg';
import SouthKoreaIcon from '@/assets/icons/flags/kr.svg';
import KuwaitIcon from '@/assets/icons/flags/kw.svg';
import LithuaniaIcon from '@/assets/icons/flags/lt.svg';
import LatviaIcon from '@/assets/icons/flags/lv.svg';
import MonacoIcon from '@/assets/icons/flags/mc.svg';
import MaltaIcon from '@/assets/icons/flags/mt.svg';
import MexicoIcon from '@/assets/icons/flags/mx.svg';
import MalaysiaIcon from '@/assets/icons/flags/my.svg';
import NicaraguaIcon from '@/assets/icons/flags/ni.svg';
import NetherlandsIcon from '@/assets/icons/flags/nl.svg';
import NorwayIcon from '@/assets/icons/flags/no.svg';
import NewZealandIcon from '@/assets/icons/flags/nz.svg';
import PhilippinesIcon from '@/assets/icons/flags/ph.svg';
import PolandIcon from '@/assets/icons/flags/pl.svg';
import PortugalIcon from '@/assets/icons/flags/pt.svg';
import QatarIcon from '@/assets/icons/flags/qa.svg';
import SaudiArabiaIcon from '@/assets/icons/flags/sa.svg';
import SwedenIcon from '@/assets/icons/flags/se.svg';
import SingaporeIcon from '@/assets/icons/flags/sg.svg';
import SloveniaIcon from '@/assets/icons/flags/si.svg';
import SlovakiaIcon from '@/assets/icons/flags/sk.svg';
import ThailandIcon from '@/assets/icons/flags/th.svg';
import USAIcon from '@/assets/icons/flags/us.svg';
import UruguayIcon from '@/assets/icons/flags/uy.svg';
import SouthAfricaIcon from '@/assets/icons/flags/za.svg';


export function attachAction(
  options: { value: string; label: string; Icon: React.FC<SvgProps> }[],
  action: (value: string) => any,
) {
  return options.map((option) => {
    if (option.label === '' && option.value === '') {
      return {
        label: ' ', onPress: () => {}
      }
    } else {
      return {
        label: `${option.label} (${option.value})`,
        icon: option.Icon,
        onPress: () => action(option.value),
      };
    }
  });
}

const countryCodeOptions = [
  // Duplicates for ease
  { value: '+1', label: 'Canada', Icon: CanadaIcon },
  { value: '+1', label: 'United States of America', Icon: USAIcon },
  { value: '', label: '', Icon: USAIcon },

  // All
  { value: '+54', label: 'Argentina', Icon: ArgentinaIcon },
  { value: '+61', label: 'Australia', Icon: AustraliaIcon },
  { value: '+43', label: 'Austria', Icon: AustriaIcon },
  { value: '+32', label: 'Belgium', Icon: BelgiumIcon },
  { value: '+55', label: 'Brazil', Icon: BrazilIcon },
  { value: '+1', label: 'Canada', Icon: CanadaIcon },
  { value: '+56', label: 'Chile', Icon: ChileIcon },
  { value: '+57', label: 'Colombia', Icon: ColombiaIcon },
  { value: '+385', label: 'Croatia', Icon: CroatiaIcon },
  { value: '+357', label: 'Cyprus', Icon: CyprusIcon },
  { value: '+20', label: 'Egypt', Icon: EgyptIcon },
  { value: '+372', label: 'Estonia', Icon: EstoniaIcon },
  { value: '+358', label: 'Finland', Icon: FinlandIcon },
  { value: '+33', label: 'France', Icon: FranceIcon },
  { value: '+49', label: 'Germany', Icon: GermanyIcon },
  { value: '+30', label: 'Greece', Icon: GreeceIcon },
  { value: '+502', label: 'Guatemala', Icon: GuatemalaIcon },
  { value: '+353', label: 'Ireland', Icon: IrelandIcon },
  { value: '+39', label: 'Italy', Icon: ItalyIcon },
  { value: '+81', label: 'Japan', Icon: JapanIcon },
  { value: '+962', label: 'Jordan', Icon: JordanIcon },
  { value: '+965', label: 'Kuwait', Icon: KuwaitIcon },
  { value: '+371', label: 'Latvia', Icon: LatviaIcon },
  { value: '+370', label: 'Lithuania', Icon: LithuaniaIcon },
  { value: '+60', label: 'Malaysia', Icon: MalaysiaIcon },
  { value: '+356', label: 'Malta', Icon: MaltaIcon },
  { value: '+52', label: 'Mexico', Icon: MexicoIcon },
  { value: '+377', label: 'Monaco', Icon: MonacoIcon },
  { value: '+31', label: 'Netherlands', Icon: NetherlandsIcon },
  { value: '+64', label: 'New Zealand', Icon: NewZealandIcon },
  { value: '+505', label: 'Nicaragua', Icon: NicaraguaIcon },
  { value: '+47', label: 'Norway', Icon: NorwayIcon },
  { value: '+63', label: 'Philippines', Icon: PhilippinesIcon },
  { value: '+48', label: 'Poland', Icon: PolandIcon },
  { value: '+351', label: 'Portugal', Icon: PortugalIcon },
  { value: '+974', label: 'Qatar', Icon: QatarIcon },
  { value: '+966', label: 'Saudi Arabia', Icon: SaudiArabiaIcon },
  { value: '+65', label: 'Singapore', Icon: SingaporeIcon },
  { value: '+421', label: 'Slovakia', Icon: SlovakiaIcon },
  { value: '+386', label: 'Slovenia', Icon: SloveniaIcon },
  { value: '+27', label: 'South Africa', Icon: SouthAfricaIcon },
  { value: '+82', label: 'South Korea', Icon: SouthKoreaIcon },
  { value: '+34', label: 'Spain', Icon: SpainIcon },
  { value: '+46', label: 'Sweden', Icon: SwedenIcon },
  { value: '+41', label: 'Switzerland', Icon: SwitzerlandIcon },
  { value: '+66', label: 'Thailand', Icon: ThailandIcon },
  { value: '+44', label: 'United Kingdom', Icon: UKIcon },
  { value: '+1', label: 'United States of America', Icon: USAIcon },
  { value: '+598', label: 'Uruguay', Icon: UruguayIcon },
];

export default countryCodeOptions;
