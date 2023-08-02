import { Button, Checkbox, Label, Modal, Table, TextInput } from 'flowbite-react';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import {
  HiCog,
  HiDotsVertical,
  HiExclamationCircle,
  HiPlus,
  HiTrash,
  HiPencil,
} from 'react-icons/hi';

import { formatCurrency } from '../../../utils/formatCurrency';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SizeForm, SizeSchema } from '../../../validate/Form';
import http from '../../../api/instance';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store/store';
import { addSize, deleteSize, getAllSizes, updateSize } from '../../../store/services/size.service';
import { ISize } from '../../../interfaces/size.type';

const Sizes = () => {
  // const { data: sizes, error, isLoading } = useFetchSizeQuery();
  const dispatch = useAppDispatch();
  const { sizes, isLoading, error } = useAppSelector(
    (state: RootState) => state.persistedReducer.size
  );

  useEffect(() => {
    dispatch(getAllSizes());
  }, []);

  return (
    <>
      <div className="block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex">
        <div className="mb-1 w-full">
          <div className="mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
              All sizes
            </h1>
          </div>
          <div className="sm:flex">
            <div className="mb-3 hidden items-center dark:divide-gray-700 sm:mb-0 sm:flex sm:divide-x sm:divide-gray-100">
              <form className="lg:pr-3">
                <Label htmlFor="users-search" className="sr-only">
                  Search
                </Label>
                <div className="relative mt-1 lg:w-64 xl:w-96">
                  <TextInput id="users-search" name="users-search" placeholder="Search for users" />
                </div>
              </form>
              <div className="mt-3 flex space-x-1 pl-0 sm:mt-0 sm:pl-2">
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Configure</span>
                  <HiCog className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Delete</span>
                  <HiTrash className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Purge</span>
                  <HiExclamationCircle className="text-2xl" />
                </a>
                <a
                  href="#"
                  className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Settings</span>
                  <HiDotsVertical className="text-2xl" />
                </a>
              </div>
            </div>
            <div className="ml-auto flex items-center space-x-2 sm:space-x-3">
              <AddSizeModal error={error} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow">
              <SizesTable sizes={sizes} error={error} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
      {/* <Pagination /> */}
    </>
  );
};

type SizeTableProps = {
  sizes?: ISize[];
  error: string;
  isLoading: boolean;
};

const SizesTable = ({ sizes, error, isLoading }: SizeTableProps) => {
  const dispatch = useAppDispatch();

  // console.log(sizes.docs.map());

  const [isEditPopupOpen, setIsEditPopupOpen] = useState<boolean>(false);
  // const [deleteSize, { isError }] = useDeleteSizeMutation();

  const [idSize, setIdSize] = useState<string>('');

  const onHandleGetSizeId = (id: string) => {
    setIdSize(id);
    setIsEditPopupOpen(true);
  };

  const togglePopup = () => {
    setIsEditPopupOpen(!isEditPopupOpen);
    setIdSize('');
  };
  // const onHandleDelete = (id: string) => {
  //   Swal.fire({
  //     icon: 'info',
  //     title: 'Do you want to delete this size?',
  //     showCancelButton: true,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire({
  //         icon: `${isError ? 'error' : 'success'}`,
  //         title: `${isError ? 'Failed. Something went wrong!' : 'Deleted'}`,
  //       }).then(() => deleteSize(id));
  //     } else {
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Everything is safe☺',
  //       });
  //     }
  //   });
  //   // const isConfirm = confirm('muon xoa a?');
  //   // if (isConfirm)
  // };
  const handleDelete = (id: string) => {
    if (!error) {
      Swal.fire({
        icon: 'info',
        title: 'Do you want to delete this size?',
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
          }).then(() => dispatch(deleteSize(id)));
        }
      });
    } else {
      toast.error('Delete failed!');
    }
  };

  if (isLoading) return <div>Loading.....</div>;
  if (error) return <div>Loi roi</div>;
  return (
    <>
      <Table className="min-w-full min-h-[100vh] divide-y divide-gray-200 dark:divide-gray-600">
        <Table.Head className="bg-gray-100 dark:bg-gray-700">
          <Table.HeadCell>
            <Label htmlFor="select-all" className="sr-only">
              Select all
            </Label>
            <Checkbox id="select-all" name="select-all" />
          </Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Price</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
          {sizes &&
            sizes?.map((item) => (
              <Table.Row key={item._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                <Table.Cell className="w-4 p-4">
                  <div className="flex items-center">
                    <Checkbox aria-describedby="checkbox-1" id="checkbox-1" />
                    <label htmlFor="checkbox-1" className="sr-only">
                      checkbox
                    </label>
                  </div>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {item.name}
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white">
                  {formatCurrency(item.price)}
                </Table.Cell>

                <Table.Cell>
                  <div className="flex items-center gap-x-3 whitespace-nowrap">
                    <Button color="primary" onClick={() => onHandleGetSizeId(item._id!)}>
                      <div className="flex items-center gap-x-3">
                        <HiPencil className="text-xl" />
                        Edit Size
                      </div>
                    </Button>

                    <Button color="failure" onClick={() => handleDelete(item._id!)}>
                      <div className="flex items-center gap-x-2">
                        <HiTrash className="text-lg" />
                        Delete size
                      </div>
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      {idSize && (
        <EditSizeModal
          isOpen={isEditPopupOpen}
          togglePopup={togglePopup}
          sizeId={idSize}
          error={error}
        />
      )}
    </>
  );
};

type AddSizeProps = {
  error: string;
};

const AddSizeModal = function ({ error }: AddSizeProps) {
  const [isOpen, setOpen] = useState<boolean>(false);
  // const [addSize] = useAddSizeMutation();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SizeForm>({
    mode: 'onChange',
    resolver: yupResolver(SizeSchema),
  });

  const onHanleSubmit = (data: any) => {
    if (!error) {
      dispatch(addSize(data));
      toast.success(`Size ${data.name} added✔`);
    } else {
      toast.error('Add size failed!');
    }
    // addSize(data);

    setOpen(false);
    reset();
  };

  return (
    <>
      <Button color="primary" onClick={() => setOpen(true)}>
        <div className="flex items-center gap-x-3">
          <HiPlus className="text-xl" />
          Add Size
        </div>
      </Button>
      <Modal
        onClose={() => {
          reset();
          setOpen(false);
        }}
        show={isOpen}
      >
        <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
          <strong>Add new Size</strong>
        </Modal.Header>
        <form action="" onSubmit={handleSubmit(onHanleSubmit)}>
          <Modal.Body>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">Name Size</Label>
                <div className="mt-1">
                  <TextInput {...register('name')} placeholder="Name" />
                </div>
                <span className="text-red-500 text-sm block my-2">
                  {errors.name && errors.name.message}
                </span>
              </div>
              <div>
                <Label htmlFor="firstName">Price Size</Label>
                <div className="mt-1">
                  <TextInput type="number" {...register('price')} placeholder="Price" />
                </div>
                <span className="text-red-500 text-sm block my-2">
                  {errors.price && errors.price.message}
                </span>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" color="primary">
              Add Size
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

type EditSizeModalProps = {
  sizeId: string;
  isOpen: boolean;
  togglePopup: () => void;
  error: string;
};

const EditSizeModal = function ({ sizeId, isOpen, togglePopup, error }: EditSizeModalProps) {
  // const { data: sizeAbc, isLoading } = useFetchSizeByIdQuery(sizeId);
  // const [fetchSize, { data: sizeabc, isLoading, isSuccess }] =
  //   SizeApi.endpoints.fetchSizeById.useLazyQuery();
  // const [updateSize] = useUpdateSizeMutation();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SizeForm>({
    mode: 'onChange',
    resolver: yupResolver(SizeSchema),
    defaultValues: async (): Promise<any> => {
      return await getSizeById(sizeId);
    },
  });

  const getSizeById = async (id: string) => {
    try {
      const { data: size } = await http.get(`/size/${id}`);

      return size.data;
    } catch (error) {
      console.log(error);
    }
  };

  const onHandleSubmit = (data: any) => {
    togglePopup();
    if (!error) {
      dispatch(updateSize(data));
      toast.success(`Edited ${data.name} size`);
    } else {
      toast.error('Update failed!');
    }
  };

  return (
    <Modal
      onClose={() => {
        togglePopup();
      }}
      show={isOpen}
      className="!bg-opacity-20"
    >
      <Modal.Header className="border-b border-gray-200 !p-6 dark:border-gray-700">
        <strong>Edit Size</strong>
      </Modal.Header>
      <form action="" onSubmit={handleSubmit(onHandleSubmit)}>
        <Modal.Body>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Name Size</Label>
              <div className="mt-1">
                <TextInput
                  {...register('name')}
                  id="name"
                  placeholder="Name"
                  // value={size?.data.name}
                />
              </div>
              <span className="text-red-500 text-sm block my-2">
                {errors.name && errors.name.message}
              </span>
            </div>
            <div>
              <Label htmlFor="price">Name Size</Label>
              <div className="mt-1">
                <TextInput
                  {...register('price')}
                  id="price"
                  placeholder="Price"
                  // value={size?.data.price}
                />
              </div>
              <span className="text-red-500 text-sm block my-2">
                {errors.price && errors.price.message}
              </span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="submit" color="primary">
            Edit Size
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
export default Sizes;
