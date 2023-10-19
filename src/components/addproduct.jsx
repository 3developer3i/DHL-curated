
import React, { useState, useContext, useRef, useCallback, useEffect } from 'react';
import {
    Page,
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Thumbnail,
    Button,
    Collapsible,
    TextContainer,
    Link
} from '@shopify/polaris';
import TrackModalExample from './trackmodal';
import { ModalContext } from '../context/modalContext';
import DeletePopup from './popopdelete';
import axios from 'axios';

function AddproductTable({ countproductlists, ordernumber, customer, d }) {

    // const Ids = id;
    const modalcontext = useContext(ModalContext);
    const { setTrackingId, setBabyorderlists, order_list, setMotherOrder, orderlength, opentable, motherOrderData } = modalcontext;

    console.log(order_list,"order_list..");
    const newData = order_list && order_list;
    const dateString = d;
    const dateParts = dateString && dateString.split(" ");
    const month = dateParts && dateParts[0];
    const day = dateParts && dateParts[1];
    const [selectedproduct, setselectedproduct] = useState([]);

    const [motherData, setMotherData] = useState([{
        baby_total: "$25:00",
        baby_order_number: "DHL1",
        baby_date: "2023-10-05T11:08:19.803Z",
        baby_title: "Airboy mini pop"
    }]);

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };

    const remainsproducts = newData && countproductlists - newData.length;

    // const deselect
    const messageDisplayedRef = useRef(false);

    // useEffect(() => {
    //     if (remainsproducts === 0 && !messageDisplayedRef.current) {
    //         const elementToHide = document.querySelector(
    //             ".Polaris-ResourceList__HeaderWrapper.Polaris-ResourceList__HeaderWrapper--hasSelect.Polaris-ResourceList__HeaderWrapper--inSelectMode"
    //         );
    //         if (elementToHide) {
    //             elementToHide.style.display = "none";
    //         }

    //         const elementToHide1 = document.querySelector(
    //             ".Polaris-ResourceList__ResourceListWrapper"
    //         );

    //         if (elementToHide1) {
    //             elementToHide1.style.display = "none";
    //             const messageDiv = document.createElement("div");
    //             messageDiv.textContent = "All Items Is Added In Baby Order.";
    //             messageDiv.style.color = "blue";
    //             messageDiv.style.fontWeight = "bold";
    //             elementToHide1.parentElement.appendChild(messageDiv);

    //             // Set the messageDisplayedRef to true to prevent it from displaying again
    //             messageDisplayedRef.current = true;
    //         }
    //     }
    // }, [remainsproducts]);

    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(order_list);
    const { } = useIndexResourceState(motherOrderData);

    useEffect(() => {
        if (selectedResources.length > 0) {
            setTrackingId(selectedResources[0]);
            if (orderlength === selectedResources.length) {
                setMotherOrder(true);
            } else {
                setMotherOrder(false);
            };
        };
        // const hideele = document.getElementById("testhideid");
        // if (hideele) {
        //     const elel = document.querySelector(".Polaris-IndexTable .Polaris-IndexTable-ScrollContainer .Polaris-IndexTable__Table Polaris-IndexTable__Table--sticky .Polaris-IndexTable__TableHeading Polaris-IndexTable__TableHeading--first");
        //     if (elel) {
        //         elel.style.display = "none"
        //     };
        // };
        if (selectedResources.length !== 0) {
            setBabyorderlists(false);
        } else {
            setBabyorderlists(true);
        };
    }, [selectedResources, orderlength]);

    const handleTrackModalClick = async (e, index) => {
        e.stopPropagation();
    };

    const [toggle, setToggle] = useState(false);

    const rowMarkup = order_list && order_list.map(
        ({ baby_total, baby_order_number, baby_date, baby_title }, index) => (
            <>
                <IndexTable.Row
                    id={index + 10}
                    key={index + 10}
                    selected={selectedResources.includes(index + 10)}
                    position={index}
                    onClick={() => setToggle(!toggle)}
                >
                    <IndexTable.Cell> &nbsp;&nbsp;#{baby_order_number}</IndexTable.Cell>
                    {/* <IndexTable.Cell> &nbsp;&nbsp;{`#${index > 3 ? 1007   : 1005}`} </IndexTable.Cell> */}
                    <IndexTable.Cell>{baby_title}</IndexTable.Cell>
                    <IndexTable.Cell>{baby_date}</IndexTable.Cell>
                    <IndexTable.Cell>
                        <div onClick={(e) => handleTrackModalClick(e, index)}>
                            <TrackModalExample trackingId={index} sub_order={order_list} />
                        </div>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <div onClick={handleTrackModalClick}>
                            <DeletePopup baby_order_number={baby_order_number} />
                        </div>
                    </IndexTable.Cell>
                </IndexTable.Row>
            </>
        ),
    );

    const [motherTrue, setMotherTrue] = useState(false);

    const rowMarkups = motherOrderData.length > 0 && motherOrderData.map(
        ({ price, mother_order_id
            , mother_order_date, mother_order_number
        }, index) => (
            <IndexTable.Row
                id={index + 100}
                key={index + 100}
                selected={motherTrue}
                position={index}
            >
                <IndexTable.Cell>{mother_order_id} </IndexTable.Cell>
                <IndexTable.Cell>{mother_order_number}</IndexTable.Cell>
                <IndexTable.Cell>{mother_order_date}</IndexTable.Cell>
                <IndexTable.Cell>${price}</IndexTable.Cell>
                <IndexTable.Cell>
                    <div onClick={(e) => handleTrackModalClick(e, index)}>
                        <TrackModalExample trackingId={index} sub_order={motherOrderData} />
                    </div>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <div onClick={handleTrackModalClick}>
                        <DeletePopup mother_order_number={mother_order_id} />
                    </div>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );

    return (
        <>
            <div>
                <LegacyCard title="Baby Order Lists">
                    <div id='testhideid'>
                        <IndexTable
                            resourceName={resourceName}
                            itemCount={order_list.length}
                            selectedItemsCount={
                                allResourcesSelected ? 'All' : selectedResources.length
                            }
                            selectable
                            onSelectionChange={handleSelectionChange}
                            headings={[
                                { title: 'Order Number' },
                                // { title: 'Shopify Order' },
                                { title: 'Products Details' },
                                { title: 'Date' },
                                { title: 'Options' },
                                { title: 'Action' },
                            ]}
                        >
                            {rowMarkup}
                        </IndexTable>
                    </div>
                </LegacyCard>
            </div>


            {/* {(opentable || motherOrderData.length > 0) && <div style={{ marginTop: "10px" }}>
                <LegacyCard title="Mother Order Lists">
                    <div id='testhideid'>
                        <IndexTable
                            resourceName={resourceName}
                            itemCount={1}
                            selectedItemsCount={1}
                            selectable
                            onSelectionChange={() => setMotherTrue(!motherTrue)}
                            headings={[
                                { title: 'Order Number' },
                                { title: 'Products Details' },
                                { title: 'Date' },
                                { title: 'Total' },
                                { title: 'Add Tracking' },
                                { title: 'Action' },
                            ]}
                        >
                            {rowMarkups}
                        </IndexTable>
                    </div>
                </LegacyCard>
            </div>} */}
        </>
    );
}

export default AddproductTable;
