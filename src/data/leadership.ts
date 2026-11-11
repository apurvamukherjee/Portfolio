import type { IconType } from 'react-icons'
import { TbClipboardList, TbPlaneDeparture, TbTrophy, TbUsers } from 'react-icons/tb'

export interface LeadershipEvent {
  icon: IconType
  rolePill: string
  /** One kanji for the role, stamped on the card like a hanko seal. */
  seal: string
  title: string
  org: string
  description: string
}

export const leadershipEvents: LeadershipEvent[] = [
  {
    icon: TbTrophy,
    rolePill: 'Mentor & Judge',
    seal: '審',
    title: 'DriveBlaze Hackathon 2025',
    org: 'University of Engineering & Management, Kolkata',
    description:
      'Invited as mentor and judge to evaluate student projects and guide teams on product thinking and technical execution.',
  },
  {
    icon: TbPlaneDeparture,
    rolePill: 'Company Representative',
    seal: '代',
    title: 'India Mobile Congress 2025',
    org: 'Yashobhoomi, New Delhi',
    description:
      "Represented Mind Webs Ventures at India's flagship telecom & tech summit. 4 days of product pitching and discussions with industry leaders.",
  },
  {
    icon: TbClipboardList,
    rolePill: 'Attendee',
    seal: '参',
    title: 'CII Innovation Event & Capital Markets Conclave 2025',
    org: 'ITC Royal Bengal & ITC Sonar, Kolkata',
    description:
      'Engaged with founders, investors, and policymakers on regional innovation and startup financing at both flagship CII events.',
  },
  {
    icon: TbUsers,
    rolePill: 'Community',
    seal: '集',
    title: 'Bengal Entrepreneurs Meet-Up 2.0',
    org: 'Kolkata',
    description:
      "Participated in the regional founder and builder community gathering, networking with early-stage entrepreneurs across eastern India's startup ecosystem.",
  },
]
