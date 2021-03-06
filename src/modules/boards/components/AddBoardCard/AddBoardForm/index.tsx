import React from 'react';
import { useForm } from 'react-hook-form';
import { observer } from 'mobx-react-lite';

import ModalLayout from '../../../../common/ui-kit/ModalLayout';
import Input from '../../../../common/ui-kit/Input';
import Button from '../../../../common/ui-kit/Button';
import { useFetch } from '../../../../common/hooks';
import { IBoardPreview } from '../../../types';
import { useNotification } from '../../../../common/ui-kit/Notification';

import boardStore from '../../../store';

import styles from './AddBoardForm.module.scss';

interface IProps {
  isVisible: boolean;
  onHide: () => void;
}

interface IFormFields {
  title: string;
}

const AddBoardForm: React.FC<IProps> = observer(({ isVisible, onHide }) => {
  const { actionAddPreviewItem } = boardStore;
  const { addNotification } = useNotification();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormFields>();

  const [createRequest] = useFetch<IFormFields, IBoardPreview>('/api/board', 'POST');

  const onSubmit = async (data: IFormFields): Promise<void> => {
    const { error, response } = await createRequest(data);
    if (!error && response) {
      actionAddPreviewItem(response);
      onHide();
      addNotification({
        title: 'Успех',
        description: `Доска "${data.title}" успешно создана`
      }, { appearance: 'success' });
    } else if (error) {
      addNotification({
        title: 'Ошибка',
        description: error?.message?.toString() || 'Неизвестная ошибка'
      }, {
        appearance: 'error',
        id: `remove-${data.title}`
      });
    }
  };

  return (
    <ModalLayout overlayClickClose onClose={onHide} isVisible={isVisible}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          type="text"
          label="Название доски"
          className={styles['add-board-form__input']}
          errorText={errors.title?.message}
          {...register('title', {
            required: 'Введите название',
            minLength: {
              value: 2,
              message: 'Слишком маленькое название',
            },
            maxLength: {
              value: 80,
              message: 'Слишком большое название',
            },
          })}
        />
        <Button className={styles['add-board-form__button']} type="submit" text="Создать" theme="secondary" icon="plus" iconSide="right" />
      </form>
    </ModalLayout>
  )
});

export default AddBoardForm;
