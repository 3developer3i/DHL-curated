import React, { useState, useCallback } from 'react';
import { Popover, Icon, Grid, Thumbnail, LegacyCard, Badge, Text } from '@shopify/polaris';
import { DropdownMinor } from '@shopify/polaris-icons';

function ActionListInPopoverExample({ itemsdata }) {
    const [active, setActive] = useState(false);

    const toggleActive = useCallback(() => {
        setActive((prevActive) => !prevActive);
    }, []);

    const activator = (
        <div
            onClick={toggleActive}
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
        >
            {Object.keys(itemsdata).length} items 
            <Icon source={DropdownMinor} color="base" />
        </div>
    );

    return (
        <div>
            <Popover active={active} activator={activator} onClose={toggleActive}>
                {/* <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 12 }}> */}
                        <LegacyCard sectioned style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <Badge progress="complete">Item List</Badge>
                            {itemsdata.map((item, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', marginTop: '15px', alignItems: 'center' }}>
                                        <div style={{ marginLeft: '8px' }}>
                                            <Thumbnail
                                                source={item.product_images}
                                                alt="Black choker necklace"
                                            />
                                        </div>
                                        <div style={{ marginLeft: '8px', whiteSpace: 'normal' }}>
                                            <Text style={{ whiteSpace: 'normal' }}>
                                            {item.name} <br/><Text>price: {item.quantity} x {item.price}</Text>
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </LegacyCard>
                    {/* </Grid.Cell>
                </Grid> */}
            </Popover>
        </div>
    );
}

export default ActionListInPopoverExample;
