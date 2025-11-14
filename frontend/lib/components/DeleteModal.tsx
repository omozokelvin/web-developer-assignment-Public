import { useCreatePost } from '@/app/posts/_lib/postMutations';
import Modal, { ModalProps } from '@/lib/components/Modal';
import Button from '@/lib/components/Button';
import { Form, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@/lib/components/TextField';
import { useEffect } from 'react';

interface Props extends Omit<ModalProps, 'children'> {
  onConfirm: () => void;
  title?: string;
  subtitle?: string;
  isDeleting: boolean;
  confirmText?: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Deletion',
  subtitle = 'Are you sure you want to delete this item?',
  isDeleting,
  confirmText = 'delete',
}: Props) {
  const formik = useFormik({
    initialValues: {
      confirmText: '',
    },
    validationSchema: yup.object({
      confirmText: yup
        .string()
        .trim()
        .required('Invalid text required.')
        .test(
          'matches-dynamic-text',
          `You must type the exact text: "${confirmText}"`,
          (value) => {
            return value === confirmText;
          }
        ),
    }),
    onSubmit: async () => {
      onConfirm();
    },
  });

  const isSubmitting = isDeleting || formik.isSubmitting;

  useEffect(() => {
    if (isOpen) {
      return;
    }

    formik.resetForm();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2
        id="modal-title"
        className="font-medium text-4xl text-foreground mb-6 border-b pb-1"
      >
        {title}
      </h2>

      <h3 className="font-medium text-xl text-foreground mb-6 border-b pb-2">
        {subtitle}
      </h3>

      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
          <TextField
            id="confirmText"
            label={
              <p>
                Enter the text "<strong>{confirmText}</strong>" to confirm.
              </p>
            }
            type="text"
            {...formik.getFieldProps('confirmText')}
            disabled={isSubmitting}
            error={formik.errors.confirmText}
            touched={formik.touched.confirmText}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              onClick={onClose}
              mode="outlined"
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Delete
            </Button>
          </div>
        </Form>
      </FormikProvider>
    </Modal>
  );
}
