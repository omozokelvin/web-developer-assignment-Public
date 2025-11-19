import { useCreatePost } from '@/app/posts/_lib/postMutations';
import Modal, { ModalProps } from '@/lib/components/Modal';
import Button from '@/lib/components/Button';
import { Form, FormikProvider, useFormik } from 'formik';
import * as yup from 'yup';
import TextField from '@/lib/components/TextField';

interface Props extends Omit<ModalProps, 'children'> {
  userId: string;
}

const validationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required('Title is required')
    .max(50, 'Title cannot exceed 50 characters'),
  body: yup
    .string()
    .trim()
    .required('Body is required')
    .max(1000, 'Body cannot exceed 1000 characters'),
});

export default function NewPostModal({ isOpen, onClose, userId }: Props) {
  const { mutate: createPost, isPending: creatingPost } = useCreatePost();

  const formik = useFormik({
    initialValues: {
      title: '',
      body: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      createPost(
        { ...values, userId },
        {
          onSuccess: () => {
            resetAndClose();
          },
          onSettled: () => {
            setSubmitting(false);
          },
        }
      );
    },
  });

  const resetAndClose = () => {
    formik.resetForm();
    onClose();
  };

  const isSubmitting = creatingPost || formik.isSubmitting;

  return (
    <Modal isOpen={isOpen} onClose={resetAndClose}>
      <h2
        id="modal-title"
        className="font-medium text-4xl text-foreground mb-4 border-b pb-2"
      >
        New Post
      </h2>

      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
          <TextField
            id="post-title"
            label="Post title"
            type="text"
            {...formik.getFieldProps('title')}
            placeholder="Give your post a title"
            disabled={isSubmitting}
            error={formik.errors.title}
            touched={formik.touched.title}
          />

          <TextField
            id="post-body"
            label="Post body"
            type="textarea"
            {...formik.getFieldProps('body')}
            placeholder="Write something mind-blowing"
            disabled={isSubmitting}
            error={formik.errors.body}
            touched={formik.touched.body}
            rows={5}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              onClick={resetAndClose}
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
              Publish
            </Button>
          </div>
        </Form>
      </FormikProvider>
    </Modal>
  );
}
