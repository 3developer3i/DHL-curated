import { Button, Popover, ActionList, Icon } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import {
    MobileHorizontalDotsMajor
} from '@shopify/polaris-icons';
import EditContact from './editcontact';
// import EditContact

function ActionListInPopoverExample() {
    const [active, setActive] = useState(false);

    const toggleActive = useCallback(() => setActive((active) => !active), []);

    const handleImportedAction = useCallback(
        () => console.log('Imported action'),
        [],
    );

    const handleExportedAction = useCallback(
        () => console.log('Exported action'),
        [],
    );

    const activator = (
        <Button size='micro' onClick={toggleActive} >
            <Icon source={MobileHorizontalDotsMajor} />
        </Button>
    );

    return (
        <Popover
            active={active}
            activator={activator}
            autofocusTarget="first-node"
            onClose={toggleActive}
        >
            <ActionList
                actionRole="menuitem"
                items={[
                    {
                        // <EditContact />
                        content: 'Edit contact information',
                        onAction: handleImportedAction,
                    },
                    {
                        content: 'Edit shipping address',
                        onAction: handleExportedAction,
                    },
                ]}
            />
        </Popover>
    );
}


export default ActionListInPopoverExample;