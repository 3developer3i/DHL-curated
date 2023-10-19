
import React, { useContext, useState } from 'react';
import { Modal, Icon, FormLayout, TextField, Button } from '@shopify/polaris';
import { EditMajor, AddMajor, DeleteMajor } from '@shopify/polaris-icons'; // Import the DeleteMajor icon
import { ModalContext } from '../context/modalContext';

function Addnote() {
    const modalcontext = useContext(ModalContext);
    const { trackingNumbers, setTrackingNumbers } = modalcontext;
    const [activator, setActivator] = useState(false);
    const [active, setActive] = useState(false);

    const handleTrackingNumberChange = (index) => (newValue) => {
        const updatedTrackingNumbers = [...trackingNumbers];
        updatedTrackingNumbers[index] = newValue;
        setTrackingNumbers(updatedTrackingNumbers);
    };

    const handleDeleteField = (index) => {
        const updatedTrackingNumbers = [...trackingNumbers];
        updatedTrackingNumbers.splice(index, 1); // Remove the element at the specified index
        setTrackingNumbers(updatedTrackingNumbers);
    };

    const handleChange = () => {
        setActive(!active);
    };

    return (
        <div>
            {/* <Button onClick={handleChange} size='micro' color='#FFFFFF'>
                <Icon source={EditMajor} color='subdued' />
            </Button> */}

            <Modal
                open={active}
                onClose={handleChange}
                title="Add note"
                primaryAction={{
                    content: 'Save',
                    onAction: handleChange,
                }}
            >
                <Modal.Section>
                    <FormLayout>
                        {trackingNumbers.map((trackingNumber, index) => (
                            <div key={index} >
                                <TextField
                                    type="text"
                                    label={`Note ${index + 1}`}
                                    onChange={handleTrackingNumberChange(index)}
                                    value={trackingNumber}
                                    autoComplete="off"
                                />
                                <Button
                                    icon={DeleteMajor}
                                    plain
                                    onClick={() => handleDeleteField(index)}
                                    accessibilityLabel={`Delete Note ${index + 1}`}
                                >
                                    Delete
                                </Button>
                            </div>
                        ))}
                        <Button
                            icon={AddMajor}
                            plain
                            onClick={() => {
                                setTrackingNumbers([...trackingNumbers, '']);
                            }}
                        >
                            Add Note
                        </Button>
                    </FormLayout>
                </Modal.Section>
            </Modal>
        </div>
    );
}

export default Addnote;
