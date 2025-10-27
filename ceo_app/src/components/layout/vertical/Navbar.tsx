// Type Imports
import type { getDictionary } from '@/utils/getDictionary'

// Component Imports
import LayoutNavbar from '@layouts/components/vertical/Navbar'
import NavbarContent from './NavbarContent'

const Navbar = ({ dictionary }: { dictionary: Awaited<ReturnType<typeof getDictionary>> }) => {
  return (
    <LayoutNavbar>
      <NavbarContent dictionary={dictionary} />
    </LayoutNavbar>
  )
}

export default Navbar
