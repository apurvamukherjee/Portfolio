export interface SocialLink {
  label: string
  href: string
  icon: 'instagram' | 'linkedin' | 'github' | 'leetcode' | 'mail'
}

export const socialLinks: SocialLink[] = [
  { label: 'My Instagram', href: 'https://www.instagram.com/sameapurva', icon: 'instagram' },
  { label: 'My LinkedIn', href: 'https://www.linkedin.com/in/apurvamukherjee', icon: 'linkedin' },
  { label: 'My GitHub', href: 'https://github.com/apurvamukherjee', icon: 'github' },
  { label: 'My LeetCode', href: 'https://leetcode.com/u/apurvamukherjee/', icon: 'leetcode' },
  { label: 'My Gmail', href: 'mailto:apurvan.337@gmail.com', icon: 'mail' },
]
