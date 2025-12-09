export const CITTA_LINKS = [
  { value: 'citta-link-1', label: 'Citta Premium Link' },
  { value: 'citta-link-2', label: 'Citta Standard Link' },
  { value: 'citta-link-3', label: 'Citta Basic Link' },
  { value: 'citta-link-4', label: 'Custom Citta Link' },
];


import * as Yup from "yup";
export const validationSchema = Yup.object({
  landSizeSections: Yup.array()
    .of(
      Yup.object({
        size: Yup.number()
          .typeError("Land size must be a number")
          .min(1)
          .required("Land size is required"),

        durations: Yup.array()
          .of(
            Yup.object({
              duration: Yup.number()
                .typeError("Duration must be a number")
                .min(1)
                .required("Duration is required"),

              price: Yup.number()
                .typeError("Price must be a number")
                .min(1, "Price must be greater than 0")
                .required("Price is required"),

              cittaLink: Yup.string().required("Citta link is required"),
            })
          )
          .min(1, "At least one duration is required"),
      })
    )
    .min(1, "At least one land size section is required"),
});
export const formatToNaira = (value: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(value);
};
