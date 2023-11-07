import React, { useContext, useState } from 'react';
import { Button, Modal, TextContainer, Tooltip } from '@shopify/polaris';
import axios from 'axios';
import { BaseURl, shop } from '../contant';
import { ModalContext } from '../context/modalContext';
import {
    DeleteMajor
} from '@shopify/polaris-icons';

function DeletePopup({ baby_order_number, mother_order_number }) {

    const { setMotherOrderData, setIsLoading, ShowTable1, setShowtable, setOrder_List, setTableData, setExtraData, setSelectedItems, setLineItemsData, setOpenTable, uniqOrderId, setMotherOrder } = useContext(ModalContext);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    const fetchdDAta = async () => {
        const responsess = await axios.get(`https://${BaseURl}/get_baby_order?shop_name=${shop}&order_id=${uniqOrderId}`)
        if (responsess.status === 200) {
            console.log(responsess.data, "delete api.......");
            setIsLoading(false);
            // setShowtable(false);
            if (responsess.data.order_list) {
                setOrder_List(responsess.data.order_list);
            } else {
                setOrder_List([])
            }
            setMotherOrderData(responsess.data.mother_order_list)
            setLineItemsData(responsess.data);
            setTableData(responsess.data.order_list_extra[0].line_items);
            setExtraData(responsess.data.order_list_extra[0].line_items);
            setSelectedItems([]);
            setOpenTable(false);
            setMotherOrder(false)
        };
    }

    const handleDelete = async () => {
        const formData = new FormData();
        formData.append("shop_name", shop);
        formData.append("baby_order_id", baby_order_number);
        setIsLoading(true);
        const response = await axios.post(`https://${BaseURl}/delete_specific_baby_order`, new URLSearchParams(formData));
        if (response.status === 200) {
            fetchdDAta();
        };
        closeDeleteModal();
    };

    const handleMotherDelete = async () => {
        const formData = new FormData();
        formData.append("shop_name", shop);
        formData.append("mother_order_id", mother_order_number)
        setIsLoading(true);

        const response = await axios.post(`http://${BaseURl}/delete_specific_mother_order`, new URLSearchParams(formData));
        if (response.status === 200) {
            console.log(response, "mother.....");
            fetchdDAta()
        };
        closeDeleteModal();
    };

    return (
        <div>
            <Tooltip content="delete">
                <Button destructive size='micro' onClick={openDeleteModal} accessibilityLabel='Delete' icon={DeleteMajor}></Button>
            </Tooltip>
            <Modal
                open={isDeleteModalOpen}
                onClose={closeDeleteModal}
                title="Delete Confirmation"
                primaryAction={{
                    content: 'Delete',
                    onAction: mother_order_number ? handleMotherDelete : handleDelete,
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: closeDeleteModal,
                    },
                ]}
                size="small"
            >
                <Modal.Section>
                    <TextContainer>
                        <p style={{ fontSize: '15px', fontWeight: 'bold' }}>Are you sure you want to delete the baby order #{baby_order_number}?</p>
                    </TextContainer>
                </Modal.Section>
            </Modal>
        </div>
    );
};

export default DeletePopup;