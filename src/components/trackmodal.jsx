
import { Button, Modal, FormLayout, TextField, Icon, ButtonGroup, Tooltip } from '@shopify/polaris';
import { useState, useCallback, useContext, useEffect } from 'react';
import { AddMajor, DeleteMajor } from '@shopify/polaris-icons';
import { ModalContext } from '../context/modalContext';
import {
    ReceiptMajor, LegalMajor, PrintMajor, LocationsMinor
} from '@shopify/polaris-icons';
function TrackModalExample({ sub_order, trackingId }) {

    const { setOrderLength, order_list } = useContext(ModalContext);
    const [active, setActive] = useState(false);
    const [trackingNumbers, setTrackingNumbers] = useState(['']);
    const [shippingCarriers, setShippingCarriers] = useState(['']);
    const [isAdditionalFieldsDisabled, setIsAdditionalFieldsDisabled] = useState(true);

    const handleChange = useCallback(() => setActive(!active), [active]);

    const activator = (
        <div onClick={handleChange}>
            <Icon
                source={LocationsMinor}
                tone="base"
                color='success'
            />
        </div>
    );

    const handleTrackingNumberChange = (index) => (newValue) => {
        const updatedTrackingNumbers = [...trackingNumbers];
        updatedTrackingNumbers[index] = newValue;
        setTrackingNumbers(updatedTrackingNumbers);
    };

    const handleShippingCarrierChange = (index) => (newValue) => {
        const updatedShippingCarriers = [...shippingCarriers];
        updatedShippingCarriers[index] = newValue;
        setShippingCarriers(updatedShippingCarriers);
    };

    const handleDeleteField = (index) => {
        if (index === 0) return; // Prevent deleting the first fields
        const updatedTrackingNumbers = [...trackingNumbers];
        const updatedShippingCarriers = [...shippingCarriers];
        updatedTrackingNumbers.splice(index, 1);
        updatedShippingCarriers.splice(index, 1);
        setTrackingNumbers(updatedTrackingNumbers);
        setShippingCarriers(updatedShippingCarriers);
        if (updatedShippingCarriers.length <= 1) {
            setIsAdditionalFieldsDisabled(true);
        }
    };

    const handleAddAnotherTrackingNumber = () => {
        const updatedTrackingNumbers = [...trackingNumbers, ''];
        const updatedShippingCarriers = [...shippingCarriers, ''];
        setTrackingNumbers(updatedTrackingNumbers);
        setShippingCarriers(updatedShippingCarriers);
        if (updatedShippingCarriers.length > 1) {
            setIsAdditionalFieldsDisabled(false);
        }
    };

    const newDatas = sub_order && sub_order[trackingId];
    useEffect(() => {
        if (sub_order.length > 0) {
            setOrderLength(sub_order.length)
        }
    }, [sub_order]);

    return (
        <div>
            <Modal
                // activator={activator}
                open={active}
                onClose={handleChange}
                title="Add Tracking"
                secondaryActions={{
                    content: 'Close',
                    onAction: handleChange,
                }}
            >
                <Modal.Section>
                    <FormLayout>
                        <FormLayout.Group>
                            <TextField
                                type="text"
                                label={`Tracking number`}
                                // onChange={handleTrackingNumberChange(index)}
                                value={newDatas.trackingnumber}
                                autoComplete="off"
                            />
                            <TextField
                                type="text"
                                label={`Shipping carrier`}
                                // onChange={handleShippingCarrierChange(index)}
                                value={newDatas.shipmenttrackingnumber}
                                // disabled={index === 0 ? false : isAdditionalFieldsDisabled}
                                autoComplete="off"
                            />
                        </FormLayout.Group>
                    </FormLayout>
                </Modal.Section>
            </Modal>
            <ButtonGroup>
                {/* <Tooltip content="Print Invoice">
                    <div onClick={() => window.open(order_list[trackingId - 10].filePath, '_blank')}>
                        <Icon
                            source={PrintMajor}
                            tone="base"
                            color='success'
                        />
                    </div>
                </Tooltip> */}
                <Tooltip content="Package Slip">
                    <div onClick={() => {
                        window.open(newDatas.filePath, "_blank")
                    }}>
                        <Icon
                            source={ReceiptMajor}
                            tone="base"
                            color='base'
                        />
                    </div>
                </Tooltip>
                {/* <Tooltip content="Commercial Invoice">
                    <div onClick={() => {
                        window.open(newDatas.Commercial_invoice, "_blank")
                    }}>
                        <Icon
                            source={LegalMajor}
                            tone="base"
                            color='subdued'
                        />
                    </div>
                </Tooltip> */}
                <Tooltip content="Tracking Info">
                    <div onClick={handleChange}>
                        <Icon
                            source={LocationsMinor}
                            tone="base"
                            color='success'
                        />
                    </div>
                </Tooltip>
            </ButtonGroup>
        </div>
    );
}

export default TrackModalExample;
