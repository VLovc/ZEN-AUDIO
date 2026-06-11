// src/theme.js

/**
 * Global Motion Variants for Framer Motion
 * Dùng chung cho toàn bộ ứng dụng để đảm bảo tính nhất quán (consistency).
 */
export const motionVariants = {
  // Page Transition (Chuyển trang mượt mà)
  pageFade: {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: "easeOut" } 
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      transition: { duration: 0.2 } 
    }
  },
  
  // Staggered List (Danh sách xếp chồng) - Dùng cho thẻ <ul>
  listContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  },
  
  // List Item - Dùng cho thẻ <li> bên trong listContainer
  listItem: {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    }
  },
  
  // Fade In Đơn Giản
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  }
};

/**
 * UI Guidelines Constants
 * Nếu cần truy xuất các giá trị này trong JS (Ví dụ: tính toán width, timeout)
 */
export const UI = {
  spacing: {
    pagePaddingX: 'px-6 md:px-10',
    pagePaddingY: 'py-6 md:py-10',
    sectionGap: 'gap-12',
    itemGap: 'gap-3',
  },
  rounded: {
    button: 'rounded-full',
    cardSmall: 'rounded-lg',
    cardLarge: 'rounded-xl',
  }
};
