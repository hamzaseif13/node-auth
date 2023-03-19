import React from 'react'
import logo from '../assets/footer.svg'

function Footer() {
  return (
    <footer className='bg-darkblue p-10 mt-[5rem]' >
        <img src={logo} alt="" className='h-28 m-auto' />
    </footer>
  )
}

export default Footer