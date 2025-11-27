'use client';

import { ResponsiveModal } from '@/components/responsive-modal';
import { useModal } from '@/hooks/use-modal';

import MultiStepForm from './multi-step-form';

const CreatePhotoModal = () => {
  const { isOpen, onClose } = useModal();

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={onClose}
      title="Create Photo"
      className="sm:max-w-3xl"
    >
      <MultiStepForm />
    </ResponsiveModal>
  );
};

export default CreatePhotoModal;
