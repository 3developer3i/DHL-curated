
import { Page, Popover, Select, LegacyCard, Grid, Layout, FormLayout, TextField, Text, Checkbox, ResourceList, ResourceItem, Button, Thumbnail, Icon, LegacyStack, Banner, Toast, Frame, Pagination } from '@shopify/polaris';
import { useState, useCallback, useEffect, useContext } from 'react';
import {
    EditMajor, MobileBackArrowMajor
} from '@shopify/polaris-icons';
import ComboboxExample from './search';
import './index.css';
import Table from './table';
import TrackModalExample from './trackmodal';
import AddproductTable from './addproduct';
import Addnote from './addnote';
import ActionListInPopoverExample from './customerpopover';
import { ModalContext } from '../context/modalContext';
import axios from 'axios';
import './loader.css';
import { BaseURl, conditionPath } from '../contant';
import { shop } from '../contant';

function OpenModal({ ordernumber, alreadybabyorder, date, customer, lineItemsData, id, setIsModalOpen, setIsLoading1, isLoading1 }) {
    const [checked, setChecked] = useState(false);

    const currentPath = window.location.pathname;

    const textStyle = {
        fontSize: '14px', // Adjust the font size as needed
        fontWeight: 'normal', // This is the default weight, so it's not necessary to specify it
    };

    const modalcontext = useContext(ModalContext)
    const { uniqOrderId, setMotherOrderData, isLoading, ShowTable1, setShowtable, setIsLoading, setSelectedItems, selectedItems, setBabyOrderData, setTableData, tableData, setParentBabyOrder, setOpenTable, setOrder_List, setCallApiParentBaby, callApiParentBaby, order_list, setMotherOrder, babyIDs, babyOrderIDs, setBabyOrderNumber, openmotherorder, setSub_order, identifiersData, parentBabyOrder, setIdentifiersData, newPage_order_number, newPage_order_numberorginal } = modalcontext;

    const [isModalClose, setIsModalClose] = useState(false);
    const closeModal = () => { setIsModalOpen(false); };

    const [createbabyorder, setcreatebabyorder] = useState(false)
    const [newData, setNewData] = useState([]);
    const [discheckbox, setDischeckbox] = useState(true);
    const [customerData, setCustomerData] = useState([]);
    const [storecreatedata, setStorecreatedata] = useState([]);
    const [toastmessage, setToastMessage] = useState(false);
    const [APIMessage, setAPIMessage] = useState("");

    const toggleActive = useCallback(() => setToastMessage((toastmessage) => !toastmessage), []);

    const toastMarkup = toastmessage ? (
        <Toast content={APIMessage} onDismiss={toggleActive} />
    ) : null;

    // https://3itesth18.pagekite.me/create_baby_order
    const notes = lineItemsData && lineItemsData.order_list_extra[0].note ? lineItemsData.order_list_extra[0].note : 'No notes from customer';

    const fetchSaveLineItemsApproved = async () => {
        const apiUrl = `https://${BaseURl}/order_approval`;
        const formData = new FormData();
        formData.append("shop", shop);
        formData.append("order_id", newPage_order_number);
        try {
            const response = await axios.post(apiUrl, new URLSearchParams(formData));
            // console.log("new page.....open modal", response.data);
            setTableData(response.data.order_list[0].line_items);
        } catch (error) {
            console.log(error);
        }
    };

    const activeApproveItems = async (product_id, variant_id) => {
        const apiUrl = `https://${BaseURl}/approve_lineitem`;
        const formData = new FormData();
        formData.append("shop", shop);
        formData.append("variant_id", variant_id);
        formData.append("product_id", product_id);
        formData.append("order_id", newPage_order_number);
        try {
            const response = await axios.post(apiUrl, new URLSearchParams(formData));
            // console.log(response.data, "approved api response.. ");
            if (response.data.status == 200) {
                setAPIMessage(response.data.msg);
                toggleActive();
                fetchSaveLineItemsApproved();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const activeInApproveItems = async (product_id, variant_id) => {
        const apiUrl = `https://${BaseURl}/remove_lineitem`;
        const formData = new FormData();
        formData.append("shop", shop);
        formData.append("variant_id", variant_id);
        formData.append("product_id", product_id);
        formData.append("order_id", newPage_order_number);
        try {
            const response = await axios.post(apiUrl, new URLSearchParams(formData));
            // console.log(response.data, "remove_lineitem api response.. ");
            if (response.data.status == 200) {
                setAPIMessage(response.data.msg);
                toggleActive();
                fetchSaveLineItemsApproved();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleToggle = (item) => {
        const updatedItems = tableData.map((lineItem) => {
            if (lineItem.variant_id === item.variant_id) {
                // Toggle the is_accepted property for the clicked item
                return { ...lineItem, is_accepted: !lineItem.is_accepted };
            }
            return lineItem;
        });

        // Update the state with the modified items
        setTableData(updatedItems);

        // Call your API function here with the updated item
        if (!item.is_accepted) {
            activeApproveItems(item.product_id, item.variant_id);
        } else {
            activeInApproveItems(item.product_id, item.variant_id);
        }
    };

    useEffect(() => {
        if (currentPath == conditionPath) {
            // console.log('runnnn..');
            fetchSaveLineItemsApproved();
        }
    }, [currentPath, conditionPath]);

    useEffect(() => {
        if (lineItemsData) {
            // setTableData(lineItemsData.order_list_extra[0].line_items);
            if (lineItemsData.order_list_extra[0].contact_details !== null) {
                // console.log("lineItemsData.order_list_extra[0].contact_details", lineItemsData.order_list_extra[0].contact_details);
                setCustomerData(lineItemsData.order_list_extra[0].contact_details);
            };
        };
        if (selectedItems.length > 0) {
            setcreatebabyorder(true);

        } else {
            setcreatebabyorder(false);
        }
    }, [selectedItems, lineItemsData]);

    useEffect(() => {
        if (!createbabyorder) {
            const newTableData = tableData.filter((datas) => selectedItems.includes(datas.variant_id));
            // setLineItemsData(newTableData);
        }
    }, [createbabyorder]);

    const [file_path, setFilePath] = useState("")
    const [nextOrderNumber, setNextOrderNumber] = useState(1);

    const generateOrderNumber = () => {
        return 'D' + nextOrderNumber;
    };

    const [selectedBoxSize, setSelectedBoxSize] = useState('');
    const [getselctId, setGetSelectId] = useState("1");

    const [popoverActive, setPopoverActive] = useState(false);
    const [tagValue, setTagValue] = useState('');
    const [identifierId, setIdentifiersId] = useState('');
    const [identifiersSelect, setIdentifiersSelect] = useState('');

    // Convert ID key to value
    // const convertedData = identifiersData && identifiersData.map(item => ({ value: item.ID, label: `PID : ${item.PID} | SID : ${item.SID}`,  }));
    const convertedData = identifiersData && identifiersData.map((item, index) => ({ value: item.ID, label: `Mother ${item.ID} (${item.Created_parcel}/15)` }));
    const arrayOfStrings = convertedData.map(obj => obj.label);

    useEffect(() => {
        if (currentPath != conditionPath) {
            setIdentifiersSelect(convertedData[0].label);
        }
    }, []);

    useEffect(() => {
        const IdentifierElement = document.querySelector("#identifier-icon .Polaris-Select__Icon");
        if (IdentifierElement && order_list.length > 0 && popoverActive) {
            IdentifierElement.style.display = "none";
        } else {
            return;
        }
    }, [order_list, popoverActive])

    const fetchLineItems = async (checkIt) => {
        if (checkIt !== "parent") {
            setIsLoading(true);
        };
        fetch(`https://${BaseURl}/get_baby_order?shop_name=${shop}&order_id=${uniqOrderId}`)
            .then((response) => response.json())
            .then((data) => {
                setShowtable(true);
                // console.log(data, "order list create baby..................");
                // Function to replicate items based on quantity
                const replicateItems = (array) => {
                    return array.reduce((result, item) => {
                        // Replicate the item based on quantity
                        for (let i = 0; i < item.quantity; i++) {
                            result.push({ ...item });
                        }
                        return result;
                    }, []);
                };
                // Call the function with the input array
                const resultArray = replicateItems(data.order_list_extra[0].line_items);
                setTableData(data.order_list_extra[0].line_items);
                setOrder_List(data?.order_list);
                // console.log(data.identifier_Data, "delete baby after identifier...");
                setIdentifiersData(data.identifier_Data);
                setParentBabyOrder(data.parent_baby_order_list);
                setIsModalOpen(true);
                setSelectedItems([]);
                setIsLoading(false);
                if (checkIt === 'yes') {
                    toggleActive()
                }
            })
            .catch((error) => {
                console.error('Error fetching line items data:', error);
            });
    };

    const fetchData = () => {
        setIsLoading(true); // Set loading to true before making the request
        const newOrderNumber = generateOrderNumber();
        const variantIdsToRetrieve = selectedItems.map(value => {
            const matchingItem = tableData.find(item => item.name.includes(`#${value}`));
            return matchingItem?.variant_id;
        });
        const foundObject = convertedData.find(obj => obj.label === identifiersSelect);

        const formData = new FormData();
        formData.append("order_id", lineItemsData.order_list_extra[0].order_id);
        formData.append("variant_id", variantIdsToRetrieve);
        formData.append("shop_name", shop);
        formData.append("order_number", lineItemsData.order_list_extra[0].order_number);
        formData.append("select_box_size", getselctId);
        formData.append("identifier", order_list.length > 0 ? identifiersData[0]?.ID : foundObject?.value);
        setIsLoading(true);

        axios.post(`https://${BaseURl}/create_baby_order`, new URLSearchParams(formData))
            .then((res) => {
                // console.log(res.data);
                if (res.data.json_line_items === undefined) {
                    // setIsLoading(false)
                    fetchLineItems('yes');
                    // console.log(res.data.msg);
                    setAPIMessage("Baby Order Created SuccessFully");
                }
                if (res.data) {
                    setStorecreatedata(res.data.json_line_items);
                    setFilePath(res.data.file_path);
                    setSub_order(res.data.sub_order);
                    fetchLineItems();
                }
                // setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });

    };

    function ShowTable() {

        // selectedItems.map((datas) => {
        //     const ids = document.getElementById(datas);
        //     if (ids) {
        //         ids.style.display = "none"
        //     }
        // }
        // )
        fetchData(newData);
        setBabyOrderData(newData);
        setBabyOrderNumber(ordernumber);
        setDischeckbox(true);
        // setShowtable(true);
        setDischeckbox(false);
        setcreatebabyorder(false);
        setPopoverActive(false);
    };

    const fetchMotherData = () => {
        const formData = new FormData();
        formData.append("order_id", lineItemsData.order_list_extra[0].order_id);
        formData.append("shop_name", shop);
        setIsLoading(true);
        axios.post(`https://${BaseURl}/create_mother_order`, new URLSearchParams(formData)).then((res) => {
            if (res.status === 200) {
                // console.log(res.data, "mother..........");
                fetch(`https://${BaseURl}/get_baby_order?shop_name=${shop}&order_id=${uniqOrderId}`)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.mother_order_list.length > 0) {
                            setIsLoading(false);
                            setOpenTable(true);
                            setMotherOrder(false);
                            setMotherOrderData(data.mother_order_list);
                        };
                    })
                    .catch((error) => {
                        console.error('Error fetching line items data:', error);
                    });
            }
            // setOpenTable(true);
        }).catch((err) => console.log(err))
    };

    const handleSelectChange = (selectedValue) => {
        switch (selectedValue) {
            case "COAT BOXES - 40 x 26 x 10":
                setGetSelectId(1);
                setSelectedBoxSize(selectedValue);
                break;
            case "SWEATER BOXES - 37 x 30 x 6":
                setGetSelectId(2);
                setSelectedBoxSize(selectedValue);
                break;
            case "SHOULDER BAG BOXES - 36 x 22 x 11":
                setGetSelectId(3);
                setSelectedBoxSize(selectedValue);
                break;
            case "MINI BAG BOX - 28 x 20 x 8":
                setGetSelectId(4);
                setSelectedBoxSize(selectedValue);
                break;

            default:
                break;
        }
    };

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );

    const handleTagValueChange = useCallback(
        (value) => setTagValue(value),
        [],
    );

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 5;

    const paginatedData = tableData.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalItems = tableData.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // create_parent_baby_order APIS

    const createParentBabyOrder = () => {
        const formData = new FormData();
        formData.append("order_id", babyOrderIDs);
        formData.append("baby_list", babyIDs);
        formData.append("shop_name", shop);
        formData.append("shipperselect", "1");
        setIsLoading(true);
        axios.post(`https://${BaseURl}/create_parent_baby_order`, new URLSearchParams(formData)).then((res) => {
            // console.log(res.data, "parent baby......");
            if (res.status === 200) {
                setTimeout(() => {
                    fetchLineItems('parent');
                }, 500);
                setCallApiParentBaby(true);
            }
        }).catch((err) => console.log(err))
    };

    const fetchGetUniqId = (names) => {
        const productName = names;
        const match = productName.match(/#(\d+)/);

        let id;

        if (match) {
            // The match[1] captures the digits within the parentheses
            id = parseInt(match[1], 10);
        }

        return id

    };

    return (
        <>
            {(isLoading1 || isLoading) && (
                <div className="spinner">
                    <img src="https://i.stack.imgur.com/hzk6C.gif" alt="Loading..." />
                </div>
            )}
            <Page
                title={
                    <>
                        <div style={{ display: 'flex', alignItems: 'center' }}  >
                            <a href='#' onClick={closeModal}>
                                <Icon color='base' source={MobileBackArrowMajor} />
                            </a>
                            {currentPath !== conditionPath ? <div style={{ display: 'flex', marginLeft: "10Px", alignItems: 'center', fontWeight: "bold" }}>
                                #{lineItemsData && lineItemsData.order_list_extra[0].order_number && lineItemsData.order_list_extra[0].order_number}
                            </div> : <div style={{ display: 'flex', marginLeft: "10Px", alignItems: 'center', fontWeight: "bold" }}>
                                #{newPage_order_numberorginal}
                            </div>}
                            {currentPath !== conditionPath && <div style={{ marginLeft: "25%" }}>
                                <Popover
                                    active={popoverActive}
                                    activator={<Button size='slim' primary onClick={() => togglePopoverActive()} disabled={createbabyorder && !openmotherorder ? false : true}>CREATE PARCEL</Button>}
                                    onClose={togglePopoverActive}
                                    ariaHaspopup={false}
                                    sectioned
                                >
                                    <FormLayout>
                                        <Select value={selectedBoxSize}
                                            onChange={handleSelectChange} label="Box Sizes:" options={['COAT BOXES - 40 x 26 x 10', 'SWEATER BOXES - 37 x 30 x 6', 'SHOULDER BAG BOXES - 36 x 22 x 11', 'MINI BAG BOX - 28 x 20 x 8']} />
                                        <div id='identifier-icon'>
                                            <Select disabled={order_list.length > 0 ? true : false} value={identifiersSelect}
                                                onChange={(label) => { setIdentifiersId(label); setIdentifiersSelect(label) }} requiredIndicator={false} options={arrayOfStrings} />
                                        </div>
                                        <Button primary size="slim" onClick={ShowTable}>Add to baby order</Button>
                                    </FormLayout>
                                </Popover>
                            </div>}
                            {openmotherorder && <div style={{ marginLeft: "10px" }}>
                                <Button size='slim' onClick={() => { fetchMotherData() }} primary disabled={false}>CREATE MOTHER ORDER</Button>
                            </div>}
                            {(tableData.length === 0 && parentBabyOrder.length == 0) && <div style={{ marginLeft: "10px" }}>
                                <Button size='slim' onClick={() => {
                                    setCallApiParentBaby(true); // Iterate through the data and collect baby_ID values
                                    createParentBabyOrder();
                                }} disabled={parentBabyOrder.length == 0 ? false : true} primary>CREATE PARENT BABY ORDER</Button>
                            </div>}
                        </div>
                    </>
                }
            >
                {/* <Grid>
                            <Grid.Cell columnSpan={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}> */}
                <div style={{ display: window.innerWidth > 630 ? "flex" : "", justifyContent: "space-between" }}>
                    <div style={{ marginRight: window.innerWidth > 630 ? "10px" : "" }}>
                        <LegacyCard sectioned>
                            <Layout>
                                <Layout.Section oneHalf>
                                    <LegacyCard.Section>
                                        <Text color="subdued" as="span">
                                            {lineItemsData && lineItemsData.order_list_extra[0].created_at}
                                        </Text>
                                        <div style={{ marginTop: '15px' }}>
                                            {/* <Text color="subdued" as="span">
                                                        Showing {}
                                                    </Text> */}
                                            <LegacyCard>
                                                <div id="don">
                                                    <ResourceList
                                                        resourceName={{ singular: 'product', plural: 'products' }}
                                                        selectedItems={selectedItems}
                                                        onSelectionChange={(selectedId) => {
                                                            // console.log(selectedId, "selectedId..");
                                                            setSelectedItems(selectedId);
                                                        }}
                                                        selectable={currentPath == conditionPath ? false : true}
                                                        items={paginatedData}
                                                        idForItem={(item, index) => fetchGetUniqId(item.name)}
                                                        renderItem={(item, index) => {
                                                            return (
                                                                <>
                                                                    <ResourceItem
                                                                        id={index}
                                                                        media={(
                                                                            <Thumbnail
                                                                                source={item.product_images ? item.product_images : ""}
                                                                                alt="Tucan scarf"
                                                                            />
                                                                        )}
                                                                        accessibilityLabel={`View details for ${item.name}`}
                                                                    >
                                                                        <Text variant="bodyMd" fontWeight="bold" as="h3">
                                                                            <><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                                <div>
                                                                                    <button style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer', width: "15vh" }}>
                                                                                        <span>{item.name}</span>
                                                                                    </button>
                                                                                </div>
                                                                                <div>
                                                                                    <span style={{ marginLeft: '26px' }}> <span style={textStyle}>{item.price} x {item.quantity} </span></span>
                                                                                </div>
                                                                                <div>
                                                                                    <span style={{ marginLeft: '26px' }}> <span style={textStyle}>${(parseFloat(item.price.replace(/[^\d.-]/g, '')) * item.quantity).toFixed(2)}</span></span>
                                                                                </div>
                                                                                {currentPath == conditionPath && <div>
                                                                                    <span style={{ marginLeft: '26px' }}>
                                                                                        {/* {!item?.is_accepted && <label className="switch">
                                                                                            <input id={item.variant_id} type="checkbox" checked={(checked == false && itemVariantiId == item.variant_id) ? false : checked} onChange={() => handleToggle(item)} />
                                                                                            <span className="slider round"></span>
                                                                                        </label>}
                                                                                        {item?.is_accepted && <label className="switch">
                                                                                            <input id={item.variant_id} type="checkbox" checked={(checked == false && itemVariantiId == item.variant_id) == false ? true : checked} onChange={() => 
                                                                                                handleToggle(item)} />
                                                                                            <span className="slider round"></span>
                                                                                        </label>} */}
                                                                                        <label className="switch">
                                                                                            <input
                                                                                                id={item.variant_id}
                                                                                                type="checkbox"
                                                                                                checked={item.is_accepted}
                                                                                                onChange={() => handleToggle(item)}
                                                                                            />
                                                                                            <span className="slider round"></span>
                                                                                        </label>
                                                                                    </span>
                                                                                </div>}
                                                                            </div> </>
                                                                        </Text>
                                                                    </ResourceItem>
                                                                </>
                                                            );
                                                        }}
                                                    />
                                                </div>
                                                {tableData.length > 5 &&
                                                    <>
                                                        <div className="Polaris-IndexTable__TableRow"></div>
                                                        <div style={{ display: "flex", justifyContent: "center", paddingBottom: "10px", paddingTop: "10px" }}>
                                                            <Pagination
                                                                hasPrevious={currentPage > 1}
                                                                hasNext={currentPage < totalPages}
                                                                label={`${paginatedData.length} of ${tableData.length}`}
                                                                onPrevious={() => handlePageChange(currentPage - 1)}
                                                                onNext={() => handlePageChange(currentPage + 1)}
                                                            />
                                                        </div>
                                                    </>
                                                }
                                            </LegacyCard>
                                            {tableData.length > 0 ? "" : <div style={{
                                                fontSize: '16px', // Adjust the font size as needed
                                                fontWeight: 'bold', // Make the text bold
                                                color: 'green', // Change the text color
                                                textAlign: 'center', // Center-align the text
                                                marginTop: '20px', // Add some top margin for spacing
                                            }}>
                                                No more products to allocate
                                            </div>}
                                        </div>
                                    </LegacyCard.Section>
                                </Layout.Section>
                            </Layout>
                        </LegacyCard>
                    </div>
                    {/* </Grid.Cell> */}
                    {/* <Grid.Cell columnSpan={{ xs: 5, sm: 2, md: 2, lg: 3, xl: 4 }}> */}
                    <br />
                    <div style={{ display: 'flex', flexDirection: 'column', width: "35%" }}>
                        {order_list.length > 0 && <LegacyCard
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', fontWeight: "bold" }}>
                                        Used Identifier
                                    </div>
                                    <div >
                                        <Addnote />
                                    </div>
                                </div>
                            }
                            sectioned
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'self-end' }}>
                                <div style={{ display: '', alignItems: 'center' }}>
                                    <Text fontWeight='semibold'>
                                        {`mother ${identifiersData[0]?.ID} (${identifiersData[0]?.Created_parcel}/15)`}
                                    </Text>
                                    <Text color='subdued'>
                                        PID : {identifiersData[0]?.PID} <br />
                                        SID : {identifiersData[0]?.SID}
                                    </Text>
                                </div>
                            </div>
                        </LegacyCard>}

                        {currentPath != conditionPath && customerData.map((datas, index) => {
                            // Create an array to store the names of missing fields

                            // Render LegacyCard with missing field messages
                            return (
                                <LegacyCard
                                    title={
                                        <>
                                            <div style={{ fontWeight: 'bold' }}>Customer</div>
                                            <div style={{ marginTop: '5px' }}>
                                                <Text color="subdued" as="span">
                                                    {datas.shipping_address.first_name &&
                                                        datas.shipping_address.first_name !== null
                                                        ? datas.shipping_address.first_name
                                                        : 'no name'}
                                                    <span style={{ marginLeft: '5px' }}>
                                                        {datas.shipping_address.last_name !== null
                                                            ? datas.shipping_address.last_name
                                                            : ''}
                                                    </span>
                                                </Text>
                                            </div><br />
                                            <div style={{ fontWeight: 'bold' }}>Contact Information</div>
                                            <div>
                                                {datas.contact_email !== null ? (
                                                    <div>{datas.contact_email}</div>
                                                ) : (
                                                    <div style={{ color: 'red' }}>Email: This field is required</div>
                                                )}
                                            </div>
                                            <br /><br />
                                            {/* Display email field with required message */}
                                            <div style={{ fontWeight: 'bold' }}>Shipping Address</div>

                                            {/* Include additional fields */}
                                            <div>
                                                {datas.shipping_address.address1 !== "" ? (
                                                    <div>{datas.shipping_address.address1}</div>
                                                ) : ""}
                                            </div>
                                            {/* Include additional fields */}
                                            <div>
                                                {datas.shipping_address.address2 !== "" ? (
                                                    <div>{datas.shipping_address.address2}</div>
                                                ) : ""}
                                            </div>
                                            {/* Include additional fields */}
                                            <div>
                                                {datas.shipping_address.city !== "" ? (
                                                    <div>{datas.shipping_address.city}</div>
                                                ) : ""}
                                            </div>
                                            {/* Include additional fields */}
                                            <div>
                                                {datas.shipping_address.company !== "" ? (
                                                    <div>{datas.shipping_address.company}</div>
                                                ) : ""}
                                            </div>
                                            {/* Include additional fields */}
                                            <div>
                                                {datas.shipping_address.country !== "" ? (
                                                    <div>{datas.shipping_address.country}</div>
                                                ) : ""}
                                            </div>
                                            <div>
                                                {datas.shipping_address.zip !== "" ? (
                                                    <div>{datas.shipping_address.zip}</div>
                                                ) : ""}
                                            </div>
                                        </>
                                    }
                                    sectioned
                                >
                                    {/* Rest of the LegacyCard content */}
                                </LegacyCard>
                            );
                        })}
                    </div>
                </div>
                {/* </Grid.Cell>
                        </Grid> */}
                <br />
                <Grid.Cell>
                    {(ShowTable1 || order_list.length !== 0 || parentBabyOrder.length !== 0) ? (
                        <>
                            <AddproductTable number={lineItemsData.order_list_extra[0].order_number} setToastMessage={setToastMessage} />
                        </>

                    ) : (
                        <>
                            <div style={{
                                fontSize: '24px', // Adjust the font size as needed
                                fontWeight: 'bold', // Make the text bold
                                color: 'red', // Change the text color
                                textAlign: 'center', // Center-align the text
                                marginTop: '20px', // Add some top margin for spacing
                            }}>
                                No Products Selected
                            </div>
                        </>
                    )}
                </Grid.Cell>
                <div id="toast-message" style={{ minHeight: "0px" }}>
                    <Frame>
                        {toastMarkup}
                    </Frame>
                </div>
            </Page>
        </>

    );

}


export default OpenModal;

