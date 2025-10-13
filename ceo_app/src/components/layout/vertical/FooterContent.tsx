'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useVerticalNav()

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <p>
        <span className='text-textSecondary'>{`© ${new Date().getFullYear()}, Made with `}</span>
        <span className='text-textSecondary'>{` by `}</span>
        <Link href='https://nautis.pt' target='_blank' className='text-primary uppercase'>
          Nautis
        </Link>
      </p>
      {!isBreakpointReached && (
        <div className='flex items-center gap-4'>
          <Link href='https://www.instagram.com/nautistech/' target='_blank' className='text-primary'>
            Instagram
          </Link>
          <Link href='https://nautis.pt' target='_blank' className='text-primary'>
            Request a Quote
          </Link>
        </div>
      )}
    </div>
  )
}

export default FooterContent
