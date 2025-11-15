"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps, toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

// Custom toast component with animations
const AnimatedToast = ({ toastData }: { toastData: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      }}
      whileHover={{ scale: 1.02 }}
      className="w-full"
    >
      {toastData}
    </motion.div>
  )
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      // Responsive positioning
      position="top-right"
      // Mobile responsive
      visibleToasts={5}
      // Animation duration
      duration={4000}
      // Close button
      closeButton
      // Rich colors
      richColors
      // Animation settings
      expand={false}
      gap={12}
      // Custom offsets for different screen sizes
      offset="16px"
      // Mobile-first responsive settings
      toastOptions={{
        // Base styles
        style: {
          background: 'var(--normal-bg)',
          color: 'var(--normal-text)',
          border: '1px solid var(--normal-border)',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          margin: '0',
          maxWidth: '350px',
          width: 'auto',
          minHeight: 'auto',
        },
        // Mobile responsive styles
        classNames: {
          toast: `
            group/toast
            !rounded-xl
            !border
            !shadow-lg
            backdrop-blur-sm
            transition-all
            duration-300
            ease-in-out
            hover:shadow-xl
            hover:scale-105
            data-[swipe=move]:transition-none
            data-[swipe=cancel]:translate-x-0
            data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]
            data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
            
            /* Mobile responsive */
            !max-w-[calc(100vw-2rem)]
            sm:!max-w-[350px]
            !w-auto
            !min-w-[280px]
            sm:!min-w-[300px]
            
            /* Success styles */
            [&[data-type="success"]]:!bg-green-50
            [&[data-type="success"]]:!text-green-900
            [&[data-type="success"]]:!border-green-200
            [&[data-type="success"]]:dark:!bg-green-950
            [&[data-type="success"]]:dark:!text-green-100
            [&[data-type="success"]]:dark:!border-green-800
            
            /* Error styles */
            [&[data-type="error"]]:!bg-red-50
            [&[data-type="error"]]:!text-red-900
            [&[data-type="error"]]:!border-red-200
            [&[data-type="error"]]:dark:!bg-red-950
            [&[data-type="error"]]:dark:!text-red-100
            [&[data-type="error"]]:dark:!border-red-800
            
            /* Warning styles */
            [&[data-type="warning"]]:!bg-amber-50
            [&[data-type="warning"]]:!text-amber-900
            [&[data-type="warning"]]:!border-amber-200
            [&[data-type="warning"]]:dark:!bg-amber-950
            [&[data-type="warning"]]:dark:!text-amber-100
            [&[data-type="warning"]]:dark:!border-amber-800
            
            /* Info styles */
            [&[data-type="info"]]:!bg-blue-50
            [&[data-type="info"]]:!text-blue-900
            [&[data-type="info"]]:!border-blue-200
            [&[data-type="info"]]:dark:!bg-blue-950
            [&[data-type="info"]]:dark:!text-blue-100
            [&[data-type="info"]]:dark:!border-blue-800
          `,
          title: `
            !font-semibold
            !text-sm
            sm:!text-base
            !leading-tight
          `,
          description: `
            !text-xs
            sm:!text-sm
            !mt-1
            !opacity-90
            !leading-relaxed
          `,
          actionButton: `
            !bg-transparent
            !border
            !border-current
            !text-current
            !rounded-lg
            !px-3
            !py-1
            !text-xs
            !font-medium
            !transition-all
            !duration-200
            hover:!bg-current
            hover:!text-white
            focus:!outline-none
            focus:!ring-2
            focus:!ring-current
            focus:!ring-offset-2
          `,
          cancelButton: `
            !bg-transparent
            !border
            !border-gray-300
            !text-gray-700
            !rounded-lg
            !px-3
            !py-1
            !text-xs
            !font-medium
            !transition-all
            !duration-200
            hover:!bg-gray-100
            hover:!text-gray-900
            dark:!border-gray-600
            dark:!text-gray-300
            dark:hover:!bg-gray-700
            dark:hover:!text-gray-100
            focus:!outline-none
            focus:!ring-2
            focus:!ring-gray-400
            focus:!ring-offset-2
          `,
          closeButton: `
            !bg-transparent
            !border-none
            !text-current
            !opacity-70
            hover:!opacity-100
            hover:!bg-black/5
            dark:hover:!bg-white/10
            !rounded-full
            !w-6
            !h-6
            !transition-all
            !duration-200
            focus:!outline-none
            focus:!ring-2
            focus:!ring-current
          `,
        },
      }}
      {...props}
    />
  )
}

// Custom toast functions with icons
export const toastSuccess = (message: string, description?: string) => {
  toast.success(message, {
    description,
    duration: 4000,
  })
}

export const toastError = (message: string, description?: string) => {
  toast.error(message, {
    description,
    duration: 6000,
  })
}

export const toastWarning = (message: string, description?: string) => {
  toast.warning(message, {
    description,
    duration: 5000,
  })
}

export const toastInfo = (message: string, description?: string) => {
  toast.info(message, {
    description,
    duration: 4000,
  })
}

export const toastPromise = (
  promise: Promise<any>,
  options: {
    loading: string
    success: string
    error: string
  }
) => {
  return toast.promise(promise, options)
}

export { Toaster, toast }