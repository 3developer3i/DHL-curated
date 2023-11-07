
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
import { BaseURl } from '../contant';
import { shop } from '../contant';

function OpenModal({ ordernumber, alreadybabyorder, date, customer, lineItemsData, id, setIsModalOpen, setIsLoading1, isLoading1 }) {

    const textStyle = {
        fontSize: '14px', // Adjust the font size as needed
        fontWeight: 'normal', // This is the default weight, so it's not necessary to specify it
    };

    const modalcontext = useContext(ModalContext)
    const { uniqOrderId, setMotherOrderData, isLoading, ShowTable1, setShowtable, setIsLoading, setSelectedItems, selectedItems, setBabyOrderData, setTableData, tableData, setParentBabyOrder, setOpenTable, setOrder_List, setCallApiParentBaby, callApiParentBaby, order_list, setMotherOrder, babyIDs, babyOrderIDs, setBabyOrderNumber, openmotherorder, setSub_order, sub_order, parentBabyOrder} = modalcontext;

    const [isModalClose, setIsModalClose] = useState(false);
    const closeModal = () => {setIsModalClose(true);};

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

    useEffect(() => {
        if (lineItemsData) {
            // setTableData(lineItemsData.order_list_extra[0].line_items);
            if (lineItemsData.order_list_extra[0].contact_details !== null) {
                console.log("lineItemsData.order_list_extra[0].contact_details", lineItemsData.order_list_extra[0].contact_details);
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

    const fetchLineItems = async (checkIt) => {
        if (checkIt !== "parent") {
            setIsLoading(true);
        }
        fetch(`https://${BaseURl}/get_baby_order?shop_name=${shop}&order_id=${uniqOrderId}`)
            .then((response) => response.json())
            .then((data) => {
                setShowtable(true);
                console.log(data, "data..................");
                setTableData(data.order_list_extra[0].line_items);
                setOrder_List(data.order_list);
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
        const formData = new FormData();
        formData.append("order_id", lineItemsData.order_list_extra[0].order_id);
        formData.append("variant_id", selectedItems);
        formData.append("shop_name", shop);
        formData.append("order_number", lineItemsData.order_list_extra[0].order_number);
        formData.append("select_box_size", getselctId);
        setIsLoading(true);

        axios.post(`https://${BaseURl}/create_baby_order`, new URLSearchParams(formData))
            .then((res) => {
                console.log(res.data);
                if (res.data.json_line_items === undefined) {
                    // setIsLoading(false)
                    fetchLineItems('yes');
                    console.log(res.data.msg);
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
                console.log(res.data, "mother..........");
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
            if (res.status === 200) {
                console.log(res.data, "parent baby......");
                fetchLineItems('parent');
                setCallApiParentBaby(true);
            }
        }).catch((err) => console.log(err))
    };

    return (
        <>
            {isModalClose ? (
                <>
                    <Table />
                </>
            ) : (
                <>
                    {(isLoading1 || isLoading) && (
                        <div className="spinner">
                            <div className="spinner-inner"></div>
                        </div>
                    )}
                    <Page
                        title={
                            <>
                                <div style={{ display: 'flex', alignItems: 'center' }}  >
                                    <a href='#' onClick={closeModal}>
                                        <Icon color='base' source={MobileBackArrowMajor} />
                                    </a>
                                    <div style={{ display: 'flex', marginLeft: "10Px", alignItems: 'center', fontWeight: "bold" }}>
                                        {lineItemsData && lineItemsData.order_list_extra[0].order_number && lineItemsData.order_list_extra[0].order_number}
                                    </div>
                                    <div style={{ marginLeft: "25%" }}>
                                        <Popover
                                            active={popoverActive}
                                            activator={<Button size='slim' primary onClick={() => togglePopoverActive()} disabled={createbabyorder && !openmotherorder ? false : true}>CREATE BABY ORDER</Button>}
                                            onClose={togglePopoverActive}
                                            ariaHaspopup={false}
                                            sectioned
                                        >
                                            <FormLayout>
                                                <Select value={selectedBoxSize}
                                                    onChange={handleSelectChange} label="Box Sizes:" options={['COAT BOXES - 40 x 26 x 10', 'SWEATER BOXES - 37 x 30 x 6', 'SHOULDER BAG BOXES - 36 x 22 x 11', 'MINI BAG BOX - 28 x 20 x 8']} />
                                                <Button primary size="slim" onClick={ShowTable}>Add Baby Order</Button>
                                            </FormLayout>
                                        </Popover>
                                    </div>
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
                        <Grid>
                            <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 8 }}>
                                <LegacyCard sectioned>
                                    <Layout>
                                        <Layout.Section oneHalf>
                                            <LegacyCard.Section>
                                                <Text color="subdued" as="span">
                                                    {lineItemsData && lineItemsData.order_list_extra[0].created_at}
                                                </Text>
                                                <div style={{ marginTop: '15px' }}>
                                                    <LegacyCard>
                                                        <div id="don">
                                                            <ResourceList
                                                                resourceName={{ singular: 'product', plural: 'products' }}
                                                                selectedItems={selectedItems}
                                                                onSelectionChange={(selectedId, dataId) => {
                                                                    setSelectedItems(selectedId);

                                                                }}
                                                                selectable
                                                                items={paginatedData}
                                                                idForItem={(item) => item.variant_id}
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
                                                                                            <button style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}>
                                                                                                <span>{item.name}</span>
                                                                                            </button>
                                                                                        </div>
                                                                                        <div>
                                                                                            <span style={{ marginLeft: '26px' }}> <span style={textStyle}>${item.price * item.quantity}</span></span>
                                                                                        </div>
                                                                                    </div> </>
                                                                                </Text>
                                                                            </ResourceItem>
                                                                        </>
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                        {tableData.length > 9 &&
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
                                                        All Products are Created Baby Order
                                                    </div>}
                                                </div>
                                            </LegacyCard.Section>
                                        </Layout.Section>
                                    </Layout>
                                </LegacyCard>
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ xs: 5, sm: 2, md: 2, lg: 3, xl: 4 }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <LegacyCard
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', fontWeight: "bold" }}>
                                                    Notes
                                                </div>
                                                <div >
                                                    <Addnote />
                                                </div>
                                            </div>
                                        }
                                        sectioned
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'self-end' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Text color='subdued'>
                                                    {notes}
                                                </Text>
                                            </div>
                                        </div>
                                    </LegacyCard>

                                    {customerData.map((datas, index) => {
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
                            </Grid.Cell>
                            <Grid.Cell columnSpan={{ xs: 5, sm: 2, md: 2, lg: 3, xl: 12 }}>
                                {(ShowTable1 || order_list.length !== 0 || parentBabyOrder.length !== 0) ? (
                                    <>
                                        <AddproductTable number={lineItemsData.order_list_extra[0].order_number} setToastMessage={setToastMessage}  />
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
                        </Grid>
                        <div id="toast-message">
                            <Frame>
                                {toastMarkup}
                            </Frame>
                        </div>
                    </Page>
                </>
            )}
        </>

    );
}


export default OpenModal;

