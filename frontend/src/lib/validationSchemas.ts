import * as yup from 'yup';

// Login validation schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Mật khẩu là bắt buộc'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

// Register validation schema
export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên không được vượt quá 50 ký tự')
    .required('Tên là bắt buộc'),
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: yup
    .string()
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(
      /[A-Z]/,
      'Mật khẩu phải chứa ít nhất một chữ cái viết hoa'
    )
    .matches(
      /[a-z]/,
      'Mật khẩu phải chứa ít nhất một chữ cái viết thường'
    )
    .matches(
      /[0-9]/,
      'Mật khẩu phải chứa ít nhất một chữ số'
    )
    .matches(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      'Mật khẩu phải chứa ít nhất một ký tự đặc biệt'
    )
    .required('Mật khẩu là bắt buộc'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu xác nhận không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

export type RegisterFormData = yup.InferType<typeof registerSchema>;
