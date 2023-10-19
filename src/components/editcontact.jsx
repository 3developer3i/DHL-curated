import { Button, Modal, LegacyStack, TextContainer } from '@shopify/polaris';
import { useState, useCallback } from 'react';

function EditContact() {
    const [active, setActive] = useState(true);

    const toggleModal = useCallback(() => setActive((active) => !active), []);

    const activator = <Button onClick={toggleModal}>Edit contact information</Button>;

    return (
        <div style={{ height: '500px' }}>
            <Modal
                activator={activator}
                open={active}
                onClose={toggleModal}
                title="Get a shareable link"
                primaryAction={{
                    content: 'Close',
                    onAction: toggleModal,
                }}
            >
                <Modal.Section>
                    <LegacyStack vertical>
                        <LegacyStack.Item>
                            <TextContainer>
                                <p>
                                    You can share this discount link with your customers via email
                                    or social media. Your discount will be automatically applied
                                    at checkout.
                                </p>
                            </TextContainer>
                        </LegacyStack.Item>
                    </LegacyStack>
                </Modal.Section>
            </Modal>
        </div>
    );
}

export default EditContact;