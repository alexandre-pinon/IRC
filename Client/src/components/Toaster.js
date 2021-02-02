import Swal from 'sweetalert2'

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

const Confirm = Swal.mixin({
    showCancelButton: true,
})

const makeToast = (type, message) => {
    Toast.fire({
        icon: type,
        title: message
    })
}

const makeConfirm = async (type, message) => {
    const choice = await Confirm.fire({
        icon: type,
        title: message
    })
    return choice.value
}

export {
    makeToast,
    makeConfirm
}