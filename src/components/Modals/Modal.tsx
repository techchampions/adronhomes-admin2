// // components/Modal.tsx
// import { useEffect } from "react";
// import { IoClose } from "react-icons/io5";
// import { closeModal } from "../Redux/Modal/modal_slice";
// import { useAppDispatch, useAppSelector } from "../Redux/hook";

// const Modal = () => {
//   const dispatch = useAppDispatch();
//   // const { isOpen, content } = useAppSelector((state) => state.modal);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Escape") dispatch(closeModal());
//     };

//     if (isOpen) {
//       window.addEventListener("keydown", handleKeyDown);
//     }

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [isOpen, dispatch]);

//   if (!isOpen) return null;

//   return (
//     <div
//       className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
//       onClick={() => dispatch(closeModal())}
//     >
//       <div
//         className="bg-white p-10 rounded-[25px] shadow-lg w-full max-w-[400px] relative"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <button
//           className="absolute top-4 right-3 text-gray-600 hover:text-gray-900"
//           onClick={() => dispatch(closeModal())}
//           aria-label="Close Modal"
//         >
//           <IoClose size={24} />
//         </button>
//         {content}
//       </div>
//     </div>
//   );
// };

// export default Modal;
