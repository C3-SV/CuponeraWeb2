import Swal from 'sweetalert2';

export const showError = (title, message) => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: message,
    confirmButtonColor: '#3085d6',
  });
};

export const showSuccess = (title, message) => {
  Swal.fire({
    icon: 'success',
    title: title,
    text: message,
    confirmButtonColor: '#3085d6',
  });
};

export const showWarning = (title, message) => {
  Swal.fire({
    icon: 'warning',
    title: title,
    text: message,
    confirmButtonColor: '#3085d6',
  });
};