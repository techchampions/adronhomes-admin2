import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

export default function SettingsCard() {
  const formik = useFormik({
    initialValues: {
      password: ''
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required')
    }),
    onSubmit: (values) => {
      // Handle password update logic here
      console.log('Password updated:', values.password)
    }
  })

  return (
    <div className='bg-white rounded-[30px] py-8 px-6 md:py-[145px] md:pl-[350px] md:pr-[204px]'>
      <p className='text-dark text-2xl md:text-[32px] font-[350] mb-6 md:mb-[30px]'>Personnel Details</p>
      <div className='space-y-6 md:space-y-[40px]'>
        <div>
          <h1 className='text-[#4F4F4F] text-sm font-[325] mb-2 md:mb-[10px]'>Full Name</h1>
          <p className='text-lg md:text-2xl text-[#4F4F4F] font-[350]'>Sarah Mika</p>
        </div>
        <div>
          <h1 className='text-[#4F4F4F] text-sm font-[325] mb-2 md:mb-[10px]'>Email</h1>
          <p className='text-lg md:text-2xl text-[#4F4F4F] font-[350]'>SarahMika@yahoo.com</p>
        </div>
        <div>
          <h1 className='text-[#4F4F4F] text-sm font-[325] mb-2 md:mb-[10px]'>Role</h1>
          <p className='text-lg md:text-2xl text-[#4F4F4F] font-[350]'>Marketer</p>
        </div>
      </div>

      {/* Password Form */}
      <form onSubmit={formik.handleSubmit} className='mt-8 md:mt-[40px]'>
        <div className='flex flex-col md:flex-row gap-4 md:gap-[12px] items-start md:items-end'>
          <div className='flex-grow w-full md:w-auto'>
            <label htmlFor="password" className='block text-[#4F4F4F] text-sm font-[325] mb-2 md:mb-[10px]'>
              Password
            </label>
            <div className='relative'>
              <input
                id="password"
                name="password"
                type="text"
                placeholder="Enter Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-3 text-lg md:text-2xl font-[350] border-b border-[#E0E0E0] focus:outline-none focus:border-[#272727] transition-colors ${
                  formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                }`}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="absolute text-red-500 text-xs ">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
          </div>
          
          <button
            type="submit"
            className='bg-[#272727] text-white rounded-[60px] py-3 px-6 md:py-[12px] md:px-[24px] text-sm font-bold w-full md:w-auto  transition-colors whitespace-nowrap'
          >
            Change Password
          </button>
        </div>
      </form>
    </div>
  )
}