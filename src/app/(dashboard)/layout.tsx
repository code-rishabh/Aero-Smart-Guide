import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Aero Smart Guide',
  description: 'Overview of your manual hub',
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}