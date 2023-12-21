import { ButtonGroup, Tooltip, Page, Icon, Button, Banner, Modal, FormLayout, TextField, TextContainer, Frame, Toast, Pagination } from '@shopify/polaris';
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import {
    ReceiptMajor, LegalMajor, PrintMajor, LocationsMinor,
    ChevronDownMinor, ChevronUpMinor, DeleteMajor
} from '@shopify/polaris-icons';
import DeletePopup from '../components/popopdelete';
import { BaseURl, shop } from '../contant'
import ActionListInPopoverExample from '../components/items';

const MotherOrderIndexTable = () => {

    const [loading, setLoading] = useState(false);
    const [motherorder, setMotherOrder] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addTracking, setAddTracking] = useState("");
    const [shipmenttrackingnumber, setShipmenttrackingnumber] = useState("");
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [addTracking1, setAddTracking1] = useState("");
    const [shipmenttrackingnumber1, setShipmenttrackingnumber1] = useState("");
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [addTracking2, setAddTracking2] = useState("");
    const [shipmenttrackingnumber2, setShipmenttrackingnumber2] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [toastmessage, setToastMessage] = useState(false);
    const [APIMessage, setAPIMessage] = useState("");

    const toggleActive = useCallback(() => setToastMessage((toastmessage) => !toastmessage), []);

    const toastMarkup = toastmessage ? (
        <Toast content={APIMessage} onDismiss={toggleActive} />
    ) : null;

    const fetchAllBabyOrderlist = (checkIt, name) => {
        if (checkIt !== 'yes') {
            setLoading(true);
        }
        axios.get(`https://${BaseURl}/all_mother_order?shop_name=${shop}`)
            .then((res) => {
                console.log(res, "mother order.");
                setMotherOrder(res.data.mother_order_list);
                if (name === 'mother-delete') {
                    toggleActive();
                };
                setLoading(false)
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        fetchAllBabyOrderlist();
    }, []);

    const [collapsibleStates, setCollapsibleStates] = useState(
        motherorder.map(() => false)
    );

    const [testIndex, setTestIndex] = useState(null);
    const [testIndex1, setTestIndex1] = useState(null);
    const [countBaby, setCountBaby] = useState(0);
    const [countBaby1, setCountBaby1] = useState(73);

    const toggleCollapsible = (index, datas) => {
        if (testIndex == index) {
            setTestIndex(null);
            setCountBaby1(73)
            // setCountBaby(0)
            console.log("outside");
        } else {
            setTestIndex(index);
            if (testIndex1 != null) {
                setTestIndex1(null);
                setCountBaby1(0)
                setCountBaby(0)
            }
        }
    };

    const [collapsibleStates1, setCollapsibleStates1] = useState(
        motherorder.map(() => false)
    );

    const toggleCollapsible1 = (index, datas) => {
        if (testIndex1 == index) {
            setTestIndex1(null);
            setCountBaby1(73)
            setCountBaby(0)
        } else {
            setTestIndex1(index);
        }
    };

    const DeleteSpecificMother = async (mother_order_id) => {
        const formData = new FormData();
        formData.append("shop_name", shop);
        formData.append("mother_order_id", mother_order_id)
        setLoading(true);
        const response = await axios.post(`https://${BaseURl}/delete_specific_mother_order`, new URLSearchParams(formData));
        if (response.status === 200) {
            if (response.data.success === "Mother order is deleted") {
                setAPIMessage("Mother order is deleted");
                setIsDeleteModalOpen(false);
                setTestIndex1(null);
                setTestIndex(null);
                setCountBaby(0)
                fetchAllBabyOrderlist('yes', 'mother-delete');
            }
        };
    };

    const [mothernumber, setMotherNumber] = useState("");

    const closeModal = () => {
        setIsModalOpen(!isModalOpen)
    };

    function renderNames(names) {
        const namesArray = names.split(',');

        return namesArray.map((name, index) => {
            const shouldAddLineBreak = (index + 1) % 4 === 0;
            return (
                <React.Fragment key={index}>
                    {namesArray.length > 1 ? `#${name},` : `#${name}`}&nbsp;
                    {shouldAddLineBreak && <br />}
                </React.Fragment>
            );
        });
    }

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const paginatedData = motherorder.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalItems = motherorder.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const [openPranetList, setOpenParentList] = useState(false);

    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsScrolling(window.innerWidth < 823);
        };

        // Set initial state
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <Page>
            {loading && (

                <div className="spinner">
                    <div className="spinner-inner"></div>
                </div>
            )}
            {motherorder.length === 0 && (

                <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
                    <Banner title="Mother Order Lists">
                        <p>no mother order created yet ...!!</p>
                    </Banner>
                </div>
            )}
            {paginatedData.length > 0 && !loading && (
                <div id='mother-html' className="Polaris-LegacyCard" style={{ width: isScrolling ? 'auto' : '117%' }}>
                    <div className="Polaris-LegacyCard__Header" ><h2 className="Polaris-Text--root Polaris-Text--headingMd">Mother Order Lists</h2></div>
                    <div className="Polaris-IndexTable">
                        <div className="Polaris-IndexTable__IndexTableWrapper Polaris-IndexTable__IndexTableWrapper--scrollBarHidden">
                        <div className="horizontal-scroll-container" style={{ overflowX: 'auto' }}>
                            <div className="Polaris-IndexTable-ScrollContainer">
                                <table className={`Polaris-IndexTable__Table Polaris-IndexTable__Table--sticky Polaris-IndexTable__Table--scrolling`}>
                                    <thead>
                                        <tr>
                                            {/* <th className="Polaris-IndexTable__TableHeading Polaris-IndexTable__TableHeading--first" data-index-table-heading="true">
                                                
                                            </th> */}
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Mother Order Number</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Babies Details</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Date</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Total</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Add Tracking</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Action</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData && paginatedData.map((datas, index) => {
                                            return (
                                                <>
                                                    <tr id={index} className="Polaris-IndexTable__TableRow">
                                                        {/* <td className="Polaris-IndexTable__TableCell Polaris-IndexTable__TableHeading--first">
                                                            
                                                        </td> */}
                                                        <td className="Polaris-IndexTable__TableCell">#{datas.mother_order_id}</td>
                                                        <td className="Polaris-IndexTable__TableCell">{renderNames(datas.mother_order_number)}</td>
                                                        <td className="Polaris-IndexTable__TableCell">{datas.mother_order_date}</td>
                                                        <td className="Polaris-IndexTable__TableCell">{datas.price === null ? "0$" : datas.price}</td>
                                                        <td className="Polaris-IndexTable__TableCell">
                                                            
                                                        </td>
                                                        <td className="Polaris-IndexTable__TableCell">
                                                            
                                                        </td>
                                                        <td onClick={() => {
                                                            // setCountBaby(datas.parent_baby_order_data.length > 2 ? 148 : 111); 
                                                            toggleCollapsible(index, datas)
                                                        }} className="Polaris-IndexTable__TableCell">
                                                            
                                                        </td>
                                                    </tr>

                                                    {testIndex == index &&
                                                        <tr className={`Polaris-IndexTable__TableRow ${testIndex == index ? 'collapsible-open' : ''
                                                            }`} style={{
                                                                // height: testIndex == index ? `${datas.parent_baby_order_data.length == 1 ? countBaby1 : countBaby}px` : `${countBaby}px`
                                                                height: testIndex == index && `${((datas.parent_baby_order_data.length + 1) * 37) + countBaby}px`
                                                            }}>
                                                            <div className="Polaris-LegacyCard" style={{ display: "contents" }}>
                                                                <div className="Polaris-IndexTable-ScrollContainer">
                                                                    <table style={{ position: "absolute" }} className="Polaris-IndexTable__Table Polaris-IndexTable__Table--sticky Polaris-IndexTable__Table--scrolling">
                                                                        <thead>
                                                                            <tr>
                                                                                {/* <th className="Polaris-IndexTable__TableHeading Polaris-IndexTable__TableHeading--first" data-index-table-heading="true">
                                                                                
                                                                            </th> */}
                                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Order Number</th>
                                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Parent Baby Number</th>
                                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Baby Details</th>
                                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Date</th>
                                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Total</th>
                                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Actions</th>
                                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true"></th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {datas.parent_baby_order_data.map((data1, indexs) =>
                                                                                <>
                                                                                    <tr style={{ backgroundColor: "#ebebeb" }} id={indexs} className="Polaris-IndexTable__TableRow">
                                                                                        
                                                                                        <td className="Polaris-IndexTable__TableCell">#{data1.parent_order_number}</td>
                                                                                        <td className="Polaris-IndexTable__TableCell">#{data1.parent_baby_order_id}</td>
                                                                                        <td className="Polaris-IndexTable__TableCell">
                                                                                           sa
                                                                                        </td>
                                                                                        <td className="Polaris-IndexTable__TableCell">{data1.parent_baby_order_date}</td>
                                                                                        <td className="Polaris-IndexTable__TableCell">{data1.price}</td>
                                                                                        <td className="Polaris-IndexTable__TableCell">
                                                                                            
                                                                                        </td>
                                                                                        <td onClick={() => {
                                                                                           
                                                                                            toggleCollapsible1(indexs, datas);
                                                                                        }} className="Polaris-IndexTable__TableCell">
                                                                                            {testIndex1 == indexs ? <Icon
                                                                                                source={ChevronUpMinor}
                                                                                                tone="base"
                                                                                            /> : <Icon
                                                                                                source={ChevronDownMinor}
                                                                                                tone="base"
                                                                                            />}
                                                                                        </td>
                                                                                    </tr>
                                                                                    {testIndex1 == indexs &&
                                                                                        <tr className={`Polaris-IndexTable__TableRow ${testIndex1 == indexs ? 'collapsible-open' : ''
                                                                                            }`} >
                                                                                            <div className="Polaris-LegacyCard" style={{ display: "contents" }}>
                                                                                                <div className="Polaris-IndexTable-ScrollContainer">
                                                                                                    <table style={{ position: "absolute" }} className="Polaris-IndexTable__Table Polaris-IndexTable__Table--sticky Polaris-IndexTable__Table--scrolling">
                                                                                                        <thead>
                                                                                                            <tr>
                                                                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Baby Number</th>
                                                                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Date</th>
                                                                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Box</th>
                                                                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Total</th>
                                                                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Actions</th>
                                                                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Items</th>
                                                                                                            </tr>
                                                                                                        </thead>
                                                                                                        <tbody>
                                                                                                            {data1.baby_order_data.map((data1, indexs) =>
                                                                                                                <tr style={{ backgroundColor: "white" }} id={indexs} className="Polaris-IndexTable__TableRow">
                                                                                                                    
                                                                                                                    <td className="Polaris-IndexTable__TableCell">#{data1.baby_ID}</td>
                                                                                                                    <td className="Polaris-IndexTable__TableCell">{data1.baby_date}</td>
                                                                                                                    <td className="Polaris-IndexTable__TableCell">{data1.box_type}</td>
                                                                                                                    <td className="Polaris-IndexTable__TableCell">{data1.baby_total}</td>
                                                                                                                    <td className="Polaris-IndexTable__TableCell">
                                                                                                                        
                                                                                                                    </td>
                                                                                                                    <td className="clasPolaris-IndexTable__TableCell">
                                                                                                                        <ActionListInPopoverExample fulfillmentStatus={[]}
                                                                                                                            itemsdata={data1.line_items}
                                                                                                                            quantity={data1.item_quantity}
                                                                                                                            Item='ITEMS' />
                                                                                                                    </td>
                                                                                                                </tr>)}
                                                                                                        </tbody>
                                                                                                    </table>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div class="Polaris-IndexTable__TableRow"></div>
                                                                                        </tr>
                                                                                    }
                                                                                </>
                                                                            )}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </tr>
                                                    }
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            </div>
                            <div className="Polaris-IndexTable__TableRow"></div>
                            {motherorder.length > 9 && <div style={{ display: "flex", justifyContent: "center", paddingBottom: "10px", paddingTop: "10px" }}>
                                <Pagination
                                    hasPrevious={currentPage > 1}
                                    hasNext={currentPage < totalPages}
                                    label={`${paginatedData.length} of ${motherorder.length}`}
                                    onPrevious={() => handlePageChange(currentPage - 1)}
                                    onNext={() => handlePageChange(currentPage + 1)}
                                />
                            </div>}
                        </div>
                    </div>
                </div>
            )}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Tracking"
                secondaryActions={[
                    {
                        content: 'Close',
                        onAction: closeModal,
                    },
                ]}
            >
                <Modal.Section>
                    <FormLayout>
                        <FormLayout.Group>
                            <TextField
                                type="text"
                                label="Tracking number"
                                autoComplete="off"
                                value={shipmenttrackingnumber}
                            />
                            <TextField
                                type="text"
                                label="Shipping carrier"
                                autoComplete="off"
                                value={addTracking}
                            />
                        </FormLayout.Group>
                    </FormLayout>
                </Modal.Section>
            </Modal>
            <Modal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
                title="Delete Confirmation"
                primaryAction={{
                    content: 'Delete',
                    onAction: () => DeleteSpecificMother(mothernumber),
                }}
                secondaryActions={[
                    {
                        content: 'Cancel',
                        onAction: () => setIsDeleteModalOpen(!isDeleteModalOpen),
                    },
                ]}
                size="small"
            >
                <Modal.Section>
                    <TextContainer>
                        <p style={{ fontSize: '15px', fontWeight: 'bold' }}>Are you sure you want to delete the mother_order_date order #{mothernumber}?</p>
                    </TextContainer>
                </Modal.Section>
            </Modal>
            <Modal
                open={isModalOpen1}
                onClose={() => setIsModalOpen1(false)}
                title="Add Tracking"
                secondaryActions={[
                    {
                        content: 'Close',
                        onAction: () => setIsModalOpen1(false),
                    },
                ]}
            >
                <Modal.Section>
                    <FormLayout>
                        <FormLayout.Group>
                            <TextField
                                type="text"
                                label="Tracking number"
                                autoComplete="off"
                                value={shipmenttrackingnumber1}
                            />
                            <TextField
                                type="text"
                                label="Shipping carrier"
                                autoComplete="off"
                                value={addTracking1}
                            />
                        </FormLayout.Group>
                    </FormLayout>
                </Modal.Section>
            </Modal>
            <Modal
                open={isModalOpen2}
                onClose={() => setIsModalOpen2(false)}
                title="Add Tracking"
                secondaryActions={[
                    {
                        content: 'Close',
                        onAction: () => setIsModalOpen2(),
                    },
                ]}
            >
                <Modal.Section>
                    <FormLayout>
                        <FormLayout.Group>
                            <TextField
                                type="text"
                                label="Tracking number"
                                autoComplete="off"
                                value={shipmenttrackingnumber2}
                            />
                            <TextField
                                type="text"
                                label="Shipping carrier"
                                autoComplete="off"
                                value={addTracking2}
                            />
                        </FormLayout.Group>
                    </FormLayout>
                </Modal.Section>
            </Modal>
            <div id="toast-message">
                <Frame>
                    {toastMarkup}
                </Frame>
            </div>
        </Page>
    );
};

export default MotherOrderIndexTable;
