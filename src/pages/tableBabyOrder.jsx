import {
    IndexTable,
    LegacyCard,
    useIndexResourceState,
    Text,
    Badge,
    Page,
    Banner,
} from '@shopify/polaris';
import React, { useEffect, useState, useCallback, useContext } from 'react';
import axios from 'axios';
import TrackModalExample from '../components/trackmodal';
import DeletePopup from '../components/popopdelete';
import {
    ChevronDownMinor
} from '@shopify/polaris-icons';
import { Button, Modal, FormLayout, TextField, Icon, ButtonGroup, Tooltip } from '@shopify/polaris';
import {
    ReceiptMajor, LegalMajor, DeleteMajor, LocationsMinor
} from '@shopify/polaris-icons';
import { ModalContext } from '../context/modalContext';
import { shop, BaseURl } from '../contant';
import { Frame, TextContainer } from '@shopify/polaris';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Select } from '@shopify/polaris';
// import { css } from '@emotion/react';
// import { ClipLoader } from 'react-spinners';



export default function BabyOrderList() {
    const [loading, setLoading] = useState(false);

    const { lineItemsData } = useContext(ModalContext);
    const [orderNumbers, setOrderNumbers] = useState([]);
    const [orderId, setOrderId] = useState([]);

    const [datas, setDatas] = useState([]);
    const [active, setActive] = useState(false);
    const [trackingNumbers, setTrackingNumbers] = useState(['']);
    const [shippingCarriers, setShippingCarriers] = useState(['']);
    const [isAdditionalFieldsDisabled, setIsAdditionalFieldsDisabled] = useState(true);
    const [savebabyordernumber, setSaveBabyOrderNumber] = useState([]);
    const [babyorderNumbers, setBabyOrdersNumbers] = useState([]);
    const [babyorderids, setBabyOrdersIDS] = useState([]);
    const [activetwo, setActivetwo] = useState(false);
    const handleChange = useCallback(() => setActive(!active), [active]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addTracking, setAddTracking] = useState("")
    const [shipmenttrackingnumber, setShipmenttrackingnumber] = useState("")
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [babynumber, setBabyNumber] = useState("");
    const [formData, setFormData] = useState({
        fullName: 'BBX DEPARTMENT',
        email: 'test210@gmail.com',
        mobileNumber: '+491728259291',
        phone: '+491728259291',
        addressLine1: 'HERMANN KOEHL STRASSE 1',
        addressLine2: '..',
        postalCode: '04435',
        countryCode: 'DE',
        provinceCode: 'DE',
        city: 'SCHKEUDITZ',
        companyName: 'The Curated AS C/O DHL HUB LEIPZIG GMBH',
    });
    const [shipperformData, setShipperFormData] = useState({
        shipperfullName: 'The Curated AS',
        shipperemail: 'email@email.com',
        shippermobileNumber: '32323232',
        shipperphone: '32323232',
        shipperaddressLine1: 'test',
        shipperaddressLine2: 'test',
        shipperpostalCode: '072700',
        shippercountryCode: 'CN',
        shipperprovinceCode: 'DE',
        shippercity: 'BEIJING',
        shippercompanyName: 'The Curated AS CO/warehouse',
        shipperselect: '',
    });


    const handleChangetwo = useCallback(() => setActivetwo(!active), [active]);

    const orders = [
        {
            id: '1020',
            order: '#1020',
            date: 'Jul 20 at 4:34pm',
            customer: 'Jaydon Stanton',
            total: '$969.44',
            paymentStatus: <Badge progress="complete">Paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
        {
            id: '1019',
            order: '#1019',
            date: 'Jul 20 at 3:46pm',
            customer: 'Ruben Westerfelt',
            total: '$701.19',
            paymentStatus: <Badge progress="partiallyComplete">Partially paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
        {
            id: '1018',
            order: '#1018',
            date: 'Jul 20 at 3.44pm',
            customer: 'Leo Carder',
            total: '$798.24',
            paymentStatus: <Badge progress="complete">Paid</Badge>,
            fulfillmentStatus: <Badge progress="incomplete">Unfulfilled</Badge>,
        },
    ];


    const openModal = (shipmenttrackingnumber, trackingnumber) => {
        setIsModalOpen(true);
        setAddTracking(trackingnumber)
        setShipmenttrackingnumber(shipmenttrackingnumber)
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const resourceName = {
        singular: 'order',
        plural: 'orders',
    };
    const [expandedRows, setExpandedRows] = useState({});
    const openUrl = (url) => {
        window.open(url, '_blank'); // Opens the URL in a new tab or window
    };

    const fetchAllBabyOrderlist = () => {
        setLoading(true);
        axios.get(`https://${BaseURl}/all_baby_order?shop_name=${shop}`)
            .then((res) => {
                console.log(res, "baaby...");
                setDatas(res.data.order_list);
                setLoading(false)
            })
            .catch((err) => console.log(err));

    };
    // https://${BaseURl}/create_baby_order
    useEffect(() => {
        fetchAllBabyOrderlist();
    }, []);

    useEffect(() => {
        if (datas) {
            const orderNumbersArray = datas.map(item => item.baby_order_number);
            setOrderNumbers(orderNumbersArray);
            const orderNumbersId = datas.map(item => item.baby_order_id);
            setOrderId(orderNumbersId)
        }
    }, [datas]);

    const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(datas);

    const handleChangethree = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));

        setShipperFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }))
        // console.log("fffff", formData)

        console.log("ss", shipperformData);
    }

    const validationSchema = Yup.object().shape({
        fullName: Yup.string().required('Full Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        mobileNumber: Yup.string().required('Mobile Number is required'),
        phone: Yup.string().required('phone is required'),
        addressLine1: Yup.string().required('Address Line 1 is required'),
        addressLine2: Yup.string().required('Address Line 2 is required'),
        postalCode: Yup.string().required('Postal Code is required'),
        countryCode: Yup.string().required('country code is required'),
        provinceCode: Yup.string().required('province code is required'),
        city: Yup.string().required('City is required'),
        companyName: Yup.string().required('company name is required')
    });

    const rowMarkup = datas.map(
        (
            { id, baby_order_number, baby_title, baby_total, baby_date, customer, filePath, paymentStatus, Commercial_invoice, shipmenttrackingnumber, trackingnumber },
            index,
        ) => (
            <>
                <IndexTable.Row
                    id={index}
                    key={index}
                    selected={selectedResources.includes(index)}
                    position={index}
                >
                    <IndexTable.Cell>
                        <Text variant="bodyMd" fontWeight="bold" as="span">
                            #{baby_order_number}
                        </Text>
                    </IndexTable.Cell>
                    <IndexTable.Cell><Text variant="bodyMd" fontWeight="bold" as="span">{baby_title}</Text></IndexTable.Cell>
                    <IndexTable.Cell>{baby_date}</IndexTable.Cell>
                    <IndexTable.Cell>{baby_total}</IndexTable.Cell>
                    <IndexTable.Cell>
                        <ButtonGroup>
                            {/* <Tooltip content="Print Invoice">
                                <div>
                                    <Icon
                                        source={PrintMajor}
                                        tone="base"
                                        color='success'
                                    />
                                </div>
                            </Tooltip> */}
                            <Tooltip content="Package Slip">
                                <div onClick={() => openUrl(filePath)}>
                                    <Icon
                                        source={ReceiptMajor}
                                        tone="base"
                                        color='base'
                                    />
                                </div>
                            </Tooltip>
                            <Tooltip content="Commercial Invoice">
                                <div onClick={() => {
                                    window.open(Commercial_invoice, "_blank")
                                }}>
                                    <Icon
                                        source={LegalMajor}
                                        tone="base"
                                        color='subdued'
                                    />
                                </div>
                            </Tooltip>
                            <Tooltip content="Add Tracking">
                                <div onClick={() => openModal(shipmenttrackingnumber, trackingnumber)}>
                                    <Icon
                                        source={LocationsMinor}
                                        tone="base"
                                        color='success'
                                    />
                                </div>
                            </Tooltip>
                        </ButtonGroup>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                        <Tooltip content="delete">
                            <Button onClick={() => {
                                // console.log(datas.mother_order_id);
                                setBabyNumber(baby_order_number);
                                setIsDeleteModalOpen(!isDeleteModalOpen)
                            }} destructive size='micro' accessibilityLabel='Delete' icon={DeleteMajor}></Button>
                        </Tooltip>
                    </IndexTable.Cell>
                </IndexTable.Row>
            </>
        ),
    );

    const [selectedBoxSize, setSelectedBoxSize] = useState('');
    const [getselctId, setGetSelectId] = useState("1");


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

    const activator = <Button disabled={datas.length === 0 ? true : false} pressed onClick={handleChange}>Create Mother Order</Button>;

    const handleSubmit = () => {
        // handleChange();
        const selectedBabyOrderNumbers = [];
        const selectedBabyOrderIds = [];

        selectedResources.forEach(index => {
            if (datas[index] && datas[index].baby_order_number) {
                selectedBabyOrderNumbers.push(datas[index].baby_order_number);
            };
        });
        selectedResources.forEach(index => {
            if (datas[index] && datas[index].baby_order_id) {
                selectedBabyOrderIds.push(datas[index].baby_order_id);
            };
        });
        console.log(selectedBabyOrderIds, "lineItemsData...........");
        console.log(selectedBabyOrderNumbers, "lineItemsData...........");
        const formDatas = new FormData();
        formDatas.append("baby_list", selectedBabyOrderNumbers);
        formDatas.append("order_id", selectedBabyOrderIds);
        formDatas.append("shop_name", shop);
        formDatas.append("fullName", formData.fullName);
        formDatas.append("email", formData.email);
        formDatas.append("mobileNumber", formData.mobileNumber);
        formDatas.append("phone", formData.phone);
        formDatas.append("addressLine1", formData.addressLine1);
        formDatas.append("addressLine2", formData.addressLine2);
        formDatas.append("postalCode", formData.postalCode);
        formDatas.append("countryCode", formData.countryCode);
        formDatas.append("provinceCode", formData.provinceCode);
        formDatas.append("city", formData.city);
        formDatas.append("companyName", formData.companyName);
        formDatas.append("shipperFirstName", shipperformData.shipperfullName);
        formDatas.append("shipperemail", shipperformData.shipperemail);
        formDatas.append("shippermobileNumber", shipperformData.shippermobileNumber);
        formDatas.append("shipperphone", shipperformData.shipperphone);
        formDatas.append("shipperaddressLine1", shipperformData.shipperaddressLine1);
        formDatas.append("shipperaddressLine2", shipperformData.shipperaddressLine2);
        formDatas.append("shipperpostalcode", shipperformData.shipperpostalCode);
        formDatas.append("shippercountrycode", shipperformData.shippercountryCode);
        formDatas.append("shipperprovincecode", shipperformData.shipperprovinceCode);
        formDatas.append("shippercity", shipperformData.shippercity);
        formDatas.append("shippercompanyName", shipperformData.shippercompanyName)
        formDatas.append("shipperselect", getselctId)
        setLoading(true);

        axios.post(`https://${BaseURl}/create_mother_order`, new URLSearchParams(formDatas)).then((res) => {
            if (res.status === 200) {
                console.log(res, "277788999..........");
                if (res.data.msg === "MotherOrder Created") {
                    fetchAllBabyOrderlist();
                    handleChange();
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            }
        }).catch((err) => console.log(err))

    };

    const DeleteSpecificMother = async () => {
        const formData = new FormData();
        formData.append("shop_name", shop);
        formData.append("baby_order_id", babynumber)
        setLoading(true);
        const response = await axios.post(`http://${BaseURl}/delete_specific_baby_order`, new URLSearchParams(formData));
        if (response.status === 200) {
            if (response.data.success === "Baby order is deleted") {
                fetchAllBabyOrderlist();
                setLoading(false);
                setIsDeleteModalOpen(false);
            }
        };
    };


    return (


        <Page>
            {loading && (
                <div className="spinner">
                    <div className="spinner-inner"></div>
                </div>
            )}


            <br />
            <ButtonGroup>
                {/* <Button onClick={() => ProductData()}>Add product</Button>
                <Button primary onClick={() => fetchMotherData()}>Create Mother Order</Button><br /><br /> */}
                <Formik
                    initialValues={{
                        fullName: '',
                        email: '',
                        mobileNumber: '',
                        phone: '',
                        addressLine1: '',
                        addressLine2: '',
                        postalCode: '',
                        countryCode: '',
                        provinceCode: '',
                        city: '',
                        companyName: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        // Handle form submission here
                        console.log(values);
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <Modal
                                activator={activator}
                                open={active}
                                onClose={handleChange}
                                title="Receiver/ Shipper Details"
                                titletwo="add data"
                                primaryAction={{
                                    content: 'Submit',
                                    onAction: handleSubmit,
                                }}
                            >
                                <Text variant="heading2xl" as="h2">
                                    Receiver Details
                                </Text>

                                <Modal.Section>
                                    <FormLayout>
                                        <FormLayout.Group>
                                            <div className="form-field">

                                                <label>Full Name</label>
                                                <TextField type="text" name="fullName" error={formData.fullName ? "" : "This Field Is Required"} value={formData.fullName}
                                                    onChange={(value) => handleChangethree('fullName', value)} />

                                            </div>
                                            <div className="form-field">
                                                <label>email</label>
                                                <TextField error={formData.email ? "" : "This Field Is Required"} type="text" name="email" value={formData.email}
                                                    onChange={(value) => handleChangethree('email', value)} />
                                                {!formData.email && <ErrorMessage name="email" component="div" className="error-message" />}
                                            </div>
                                            <div className="form-field">
                                                <label>mobile number</label>
                                                <TextField error={formData.mobileNumber ? "" : "This Field Is Required"} type="text" name="mobileNumber" value={formData.mobileNumber}
                                                    onChange={(value) => handleChangethree('mobileNumber', value)} />
                                                {!formData.mobileNumber && <ErrorMessage name="mobileNumber" component="div" className="error-message" />}
                                            </div>
                                            <div className="form-field">
                                                <label>phone</label>
                                                <TextField error={formData.phone ? "" : "This Field Is Required"} type="text" name="phone" value={formData.phone}
                                                    onChange={(value) => handleChangethree('phone', value)} />
                                                {!formData.phone && <ErrorMessage name="phone" component="div" className="error-message" />}

                                            </div>

                                            <div className="form-field">
                                                <label>addressLine1</label>
                                                <TextField error={formData.addressLine1 ? "" : "This Field Is Required"} type="text" name="addressLine1" value={formData.addressLine1}
                                                    onChange={(value) => handleChangethree('addressLine1', value)} />
                                                {!formData && <ErrorMessage name="addressLine1" component="div" className="error-message" />}

                                            </div>

                                            <div className="form-field">
                                                <label>addressLine2</label>
                                                <TextField error={formData.addressLine2 ? "" : "This Field Is Required"} type="text" name="addressLine2" value={formData.addressLine2}
                                                    onChange={(value) => handleChangethree('addressLine2', value)} />
                                                {!formData && <ErrorMessage name="addressLine2" component="div" className="error-message" />}
                                            </div>

                                            <div className="form-field">
                                                <label>postalCode </label>
                                                <TextField error={formData.fullName ? "" : "This Field Is Required"} type="text" name="postalCode" value={formData.postalCode}
                                                    onChange={(value) => handleChangethree('postalCode', value)} />
                                                {!formData && <ErrorMessage name="postalCode" component="div" className="error-message" />}
                                            </div>

                                            <div className="form-field">
                                                <label>countryCode </label>
                                                <TextField error={formData.countryCode ? "" : "This Field Is Required"} type="text" name="countryCode" value={formData.countryCode}
                                                    onChange={(value) => handleChangethree('countryCode', value)} />
                                                {!formData && <ErrorMessage name="countryCode" component="div" className="error-message" />}

                                            </div>


                                            <div className="form-field">
                                                <label>provincecode</label>
                                                <TextField error={formData.provinceCode ? "" : "This Field Is Required"} type="text" name="provinceCode" value={formData.provinceCode}
                                                    onChange={(value) => handleChangethree('provinceCode', value)} />
                                                {formData && <ErrorMessage name="provinceCode" component="div" className="error-message" />}
                                            </div>




                                            <div className="form-field">
                                                <label>city</label>
                                                <TextField error={formData.city ? "" : "This Field Is Required"} type="text" name="city" value={formData.city}
                                                    onChange={(value) => handleChangethree('city', value)} />
                                                {!formData && <ErrorMessage name="city" component="div" className="error-message" />}
                                            </div>


                                            <div className="form-field">
                                                <label>companyName</label>
                                                <TextField error={formData.companyName ? "" : "This Field Is Required"} type="text" name="companyName" value={formData.companyName}
                                                    onChange={(value) => handleChangethree('companyName', value)} />
                                                {!formData && <ErrorMessage name="companyName" component="div" className="error-message" />}
                                            </div>


                                        </FormLayout.Group>
                                    </FormLayout>
                                </Modal.Section>
                                <Text variant="heading3xl" as="h3">
                                    Shipper Details
                                </Text>
                                <Modal.Section>
                                    <FormLayout>
                                        <FormLayout.Group>
                                            <div className="form-field">
                                                <label>Full Name</label>
                                                <TextField type="text" name="shipperfullName" error={shipperformData.shipperfullName ? "" : "This Field Is Required"} value={shipperformData.shipperfullName}
                                                    onChange={(value) => handleChangethree('shipperfullName', value)} />
                                            </div>
                                            <div className="form-field">
                                                <label>email</label>
                                                <TextField error={shipperformData.shipperemail ? "" : "This Field Is Required"} type="text" name="shipperemail" value={shipperformData.shipperemail}
                                                    onChange={(value) => handleChangethree('shipperemail', value)} />
                                                {!shipperformData.shipperemail && <ErrorMessage name="shipperemail" component="div" className="error-message" />}
                                            </div>
                                            <div className="form-field">
                                                <label>mobile number</label>
                                                <TextField error={shipperformData.shippermobileNumber ? "" : "This Field Is Required"} type="text" name="shippermobileNumber" value={shipperformData.shippermobileNumber}
                                                    onChange={(value) => handleChangethree('shippermobileNumber', value)} />
                                                {!shipperformData.shippermobileNumber && <ErrorMessage name="shippermobileNumber" component="div" className="error-message" />}
                                            </div>
                                            <div className="form-field">
                                                <label>phone</label>
                                                <TextField error={shipperformData.shipperphone ? "" : "This Field Is Required"} type="text" name="shipperphone" value={shipperformData.shipperphone}
                                                    onChange={(value) => handleChangethree('shipperphone', value)} />
                                                {!shipperformData.shipperphone && <ErrorMessage name="shipperphone" component="div" className="error-message" />}

                                            </div>

                                            <div className="form-field">
                                                <label>addressLine1</label>
                                                <TextField error={shipperformData.shipperaddressLine1 ? "" : "This Field Is Required"} type="text" name="shipperaddressLine1" value={shipperformData.shipperaddressLine1}
                                                    onChange={(value) => handleChangethree('shipperaddressLine1', value)} />
                                                {!shipperformData.shipperaddressLine1 && <ErrorMessage name="shipperaddressLine1" component="div" className="error-message" />}

                                            </div>

                                            <div className="form-field">
                                                <label>addressLine2</label>
                                                <TextField error={shipperformData.shipperaddressLine2 ? "" : "This Field Is Required"} type="text" name="shipperaddressLine2" value={shipperformData.shipperaddressLine2}
                                                    onChange={(value) => handleChangethree('shipperaddressLine2', value)} />
                                                {!shipperformData && <ErrorMessage name="shipperaddressLine2" component="div" className="error-message" />}
                                            </div>

                                            <div className="form-field">
                                                <label>postalCode </label>
                                                <TextField error={shipperformData.shipperpostalCode ? "" : "This Field Is Required"} type="text" name="shipperpostalCode" value={shipperformData.shipperpostalCode}
                                                    onChange={(value) => handleChangethree('shipperpostalCode', value)} />
                                                {!shipperformData && <ErrorMessage name="shipperpostalCode" component="div" className="error-message" />}
                                            </div>

                                            <div className="form-field">
                                                <label>countryCode </label>
                                                <TextField error={shipperformData.shippercountryCode ? "" : "This Field Is Required"} type="text" name="shippercountryCode" value={shipperformData.shippercountryCode}
                                                    onChange={(value) => handleChangethree('shippercountryCode', value)} />
                                                {!shipperformData && <ErrorMessage name="shippercountryCode" component="div" className="error-message" />}

                                            </div>


                                            <div className="form-field">
                                                <label>provincecode</label>
                                                <TextField error={shipperformData.shipperprovinceCode ? "" : "This Field Is Required"} type="text" name="shipperprovinceCode" value={shipperformData.shipperprovinceCode}
                                                    onChange={(value) => handleChangethree('shipperprovinceCode', value)} />
                                                {shipperformData && <ErrorMessage name="shipperprovinceCode" component="div" className="error-message" />}
                                            </div>




                                            <div className="form-field">
                                                <label>city</label>
                                                <TextField error={shipperformData.shippercity ? "" : "This Field Is Required"} type="text" name="shippercity" value={shipperformData.shippercity}
                                                    onChange={(value) => handleChangethree('shippercity', value)} />
                                                {!shipperformData && <ErrorMessage name="shippercity" component="div" className="error-message" />}
                                            </div>


                                            <div className="form-field">
                                                <label>companyName</label>
                                                <TextField error={shipperformData.shippercompanyName ? "" : "This Field Is Required"} type="text" name="shippercompanyName" value={shipperformData.shippercompanyName}
                                                    onChange={(value) => handleChangethree('shippercompanyName', value)} />
                                                {!shipperformData && <ErrorMessage name="shippercompanyName" component="div" className="error-message" />}
                                            </div>

                                            <div className="form-field">
                                                <Select value={selectedBoxSize}
                                                    onChange={handleSelectChange} label="Box Sizes:" options={['COAT BOXES - 40 x 26 x 10', 'SWEATER BOXES - 37 x 30 x 6', 'SHOULDER BAG BOXES - 36 x 22 x 11', 'MINI BAG BOX - 28 x 20 x 8']} />
                                            </div>
                                        </FormLayout.Group>
                                    </FormLayout>
                                </Modal.Section>
                            </Modal>
                            <Modal
                                open={isModalOpen}
                                onClose={closeModal}
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
                        </Form>)}
                </Formik>
            </ButtonGroup>
            <br />
            {datas.length === 0 ? (
                <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
                    <Banner title="Baby Order Lists">
                        <p>no baby order created yet ...!!</p>
                    </Banner>
                </div>
            ) :
                <div id='baby-new-hide'>
                    <LegacyCard title="Baby Order Lists"><br />
                        <IndexTable
                            resourceName={resourceName}
                            itemCount={orders.length}
                            selectedItemsCount={
                                allResourcesSelected ? 'All' : selectedResources.length
                            }
                            onSelectionChange={handleSelectionChange}
                            headings={[
                                { title: 'Order Number' },
                                { title: 'Babies Details' },
                                { title: 'Date' },
                                { title: 'Total' },
                                { title: 'Add Tracking' },
                                { title: 'Action' },
                            ]}
                        >
                            {rowMarkup}
                        </IndexTable>
                    </LegacyCard>
                </div>
            }
            <Modal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
                title="Delete Confirmation"
                primaryAction={{
                    content: 'Delete',
                    onAction: () => DeleteSpecificMother(),
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
                        <p style={{ fontSize: '15px', fontWeight: 'bold' }}>Are you sure you want to delete the baby order #{babynumber}?</p>
                    </TextContainer>
                </Modal.Section>
            </Modal>
        </Page>
    );
}