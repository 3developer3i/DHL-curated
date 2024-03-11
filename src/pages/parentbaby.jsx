import { useIndexResourceState, Text, Page, Banner, Popover, Pagination } from "@shopify/polaris";
import React, { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import { Button, Modal, FormLayout, TextField, Icon, ButtonGroup, Tooltip, Toast } from "@shopify/polaris";
import { ReceiptMajor, LegalMajor, DeleteMajor, LocationsMinor } from "@shopify/polaris-icons";
import { ModalContext } from "../context/modalContext";
import { shop, BaseURl } from "../contant";
import { Frame, TextContainer } from "@shopify/polaris";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Select } from "@shopify/polaris";
import ActionListInPopoverExample from "../components/items";

export default function TestBabyOrderList() {

    const [loading, setLoading] = useState(false);
    const { parentBabyOrder, setParentBabyOrder } = useContext(ModalContext);
    const [orderNumbers, setOrderNumbers] = useState([]);
    const [orderId, setOrderId] = useState([]);

    const [datas, setDatas] = useState([]);
    const [active, setActive] = useState(false);
    const [actives, setActives] = useState(false);
    const [activetwo, setActivetwo] = useState(false);
    const handleChange = useCallback(() => setActive(!active), [active]);
    const handleChanges = useCallback(() => setActives(!actives), [actives]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addTracking, setAddTracking] = useState("");
    const [shipmenttrackingnumber, setShipmenttrackingnumber] = useState("");
    const [isModalOpen1, setIsModalOpen1] = useState(false);
    const [addTracking1, setAddTracking1] = useState("");
    const [shipmenttrackingnumber1, setShipmenttrackingnumber1] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [babynumber, setBabyNumber] = useState("");

    const [formData, setFormData] = useState({
        fullName: "BBX DEPARTMENT",
        email: "test210@gmail.com",
        mobileNumber: "+491728259291",
        phone: "+491728259291",
        addressLine1: "HERMANN KOEHL STRASSE 1",
        addressLine2: "..",
        postalCode: "04435",
        countryCode: "DE",
        provinceCode: "DE",
        city: "SCHKEUDITZ",
        companyName: "The Curated AS C/O DHL HUB LEIPZIG GMBH",
        state: ".",
        country: "."
    });

    const [shipperformData, setShipperFormData] = useState({
        shipperfullName: "The Curated AS",
        shipperemail: "email@email.com",
        shippermobileNumber: "32323232",
        shipperphone: "32323232",
        shipperaddressLine1: "",
        shipperaddressLine2: "",
        shipperpostalCode: "072700",
        shippercountryCode: "CN",
        shipperprovinceCode: "DE",
        shippercity: "BEIJING",
        shippercompanyName: "The Curated AS CO/warehouse",
        shipperselect: "",
        shipperstate: ".",
        shippercountry: "."
    });

    const [commercialForm, setCommercialForm] = useState({
        REFERENCE_NUMBER: ".",
        SHIPPER_EXPORT_REFERENCES: ".",
        SHIPPER: ".",
        COUNTRY_OF_EXPORT: ".",
        IMPORTER: ".",
        INDIRECT_REPRESENTATIVE: ".",
        REASON_FOR_EXPORT: ".",
        COUNTRY_OF_ULTIMATE_DESTINATION: ".",
        consignee_companyName: "",
        consignee_fullName: "",
        consignee_address: "",
        consignee_state: "",
        consignee_country: "",
        consignee_pincode: "",
        consignee_email: ".",
        consignee_mobile_number: ".",
        consignee_phone: ".",
        consignee_addressLine2: ".",
        consignee_countryCode: ".",
        consignee_provincecode: ".",
        consignee_city: ".",
        EORI_Id: "",
        tax_id: "",
        REPRESENTATIVE_NAME: "",
        REPRESENTATIVE_ADDRESS: "",
        REPRESENTATIVE_STATE: "",
        REPRESENTATIVE_COUNTRY: "",
        REPRESENTATIVE_ZIPCODE: "",
    });

    const validateFormData = (formData) => {
        for (const key in formData) {
            const disallowedCharactersRegex = /[(){}\[\]!"'?]/;
            // Check if the input contains any disallowed characters
            if (disallowedCharactersRegex.test(formData[key])) {
                alert("missing....")
                return false;
            }
            if (formData.hasOwnProperty(key) && formData[key].trim() === '') {
                return false; // Return false if any value is empty
            }
        }
        return true; // Return true if all values are non-empty
    };

    const validateShipperFormData = (shipperformData) => {
        for (const key in shipperformData) {
            if (shipperformData.hasOwnProperty(key) && shipperformData[key].trim() === '') {
                return false; // Return false if any value is empty
            }
        }
        return true; // Return true if all values are non-empty
    };

    const validateCommercialForm = (commercialForm) => {
        for (const key in commercialForm) {
            if (commercialForm.hasOwnProperty(key) && commercialForm[key].trim() === '') {
                return false; // Return false if any value is empty
            }
        }
        return true; // Return true if all values are non-empty
    };

    // Print Toast Message
    const [toastmessage, setToastMessage] = useState(false);
    const [popoverActive, setPopoverActive] = useState(false);
    const [APIMessage, setAPIMessage] = useState("");
    const [selectedResources, setSelectedRows] = useState([]);

    const [collapsibleStates, setCollapsibleStates] = useState(
        parentBabyOrder.map(() => false)
    );

    const toggleCollapsible = (index) => {
        const newCollapsibleStates = [...collapsibleStates];
        newCollapsibleStates[index] = !newCollapsibleStates[index];
        setCollapsibleStates(newCollapsibleStates);
    };

    const toggleActive = useCallback(() => setToastMessage((toastmessage) => !toastmessage), []);

    const togglePopoverActive = useCallback(
        () => setPopoverActive((popoverActive) => !popoverActive),
        [],
    );

    const toastMarkup = toastmessage ? (
        <Toast content={APIMessage} onDismiss={toggleActive} />
    ) : null;

    const openModal = (shipmenttrackingnumber, trackingnumber) => {
        setIsModalOpen(true);
        setAddTracking(trackingnumber);
        setShipmenttrackingnumber(shipmenttrackingnumber);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const { allResourcesSelected, handleSelectionChange } = useIndexResourceState(parentBabyOrder);

    const fetchAllBabyOrderlist = (checkIt, name) => {
        if (checkIt !== "yes") {
            setLoading(true);
        }

        axios.get(`https://${BaseURl}/all_parent_baby_order?shop_name=${shop}`)
            .then((res) => {
                // console.log(res, "all_parent_baby_order...");
                setParentBabyOrder(res.data.parent_baby_order_list);
                setDatas(res.data.parent_baby_order_list);
                if (checkIt === "parent") {
                    setLoading(false);
                } else if (res.data.parent_baby_order_list.length === 0) {
                    setLoading(false);
                }

                if (res.data) {
                    setCommercialForm({
                        REFERENCE_NUMBER:
                            res.data.commercial_data.REFERENCE_NUMBER,
                        SHIPPER_EXPORT_REFERENCES:
                            res.data.commercial_data.SHIPPER_EXPORT_REFERENCES,
                        SHIPPER: res.data.commercial_data.SHIPPER,
                        // CONSIGNEE: res.data.commercial_data.CONSIGNEE,
                        COUNTRY_OF_EXPORT:
                            res.data.commercial_data.COUNTRY_OF_EXPORT,
                        IMPORTER: res.data.commercial_data.IMPORTER,
                        INDIRECT_REPRESENTATIVE:
                            res.data.commercial_data.INDIRECT_REPRESENTATIVE,
                        REASON_FOR_EXPORT:
                            res.data.commercial_data.REASON_FOR_EXPORT,
                        COUNTRY_OF_ULTIMATE_DESTINATION:
                            res.data.commercial_data.COUNTRY_OF_ULTIMATE_DESTINATION,
                        consignee_address: res.data.commercial_data.consignee_address,
                        consignee_companyName: res.data.commercial_data.consignee_companyname,
                        consignee_fullName: res.data.commercial_data.consignee_fullname,
                        consignee_country: res.data.commercial_data.consignee_country,
                        consignee_pincode: res.data.commercial_data.consignee_postalcode,
                        consignee_state: res.data.commercial_data.consignee_state,
                        consignee_email: res.data.commercial_data.consignee_email,
                        consignee_mobile_number: res.data.commercial_data.consignee_mobile_number,
                        consignee_phone: res.data.commercial_data.consignee_phone,
                        consignee_addressLine2: res.data.commercial_data.consignee_addressLine2,
                        consignee_countryCode: res.data.commercial_data.consignee_countryCode,
                        consignee_provincecode: res.data.commercial_data.consignee_provincecode,
                        consignee_city: res.data.commercial_data.consignee_city,
                        tax_id: res.data.commercial_data.tax_id,
                        EORI_Id: res.data.commercial_data.eori_id,
                        REPRESENTATIVE_NAME: res.data.commercial_data.representative_fullname,
                        REPRESENTATIVE_ADDRESS: res.data.commercial_data.representative_address,
                        REPRESENTATIVE_STATE: res.data.commercial_data.representative_state,
                        REPRESENTATIVE_COUNTRY: res.data.commercial_data.representative_country,
                        REPRESENTATIVE_ZIPCODE: res.data.commercial_data.representative_postalcode,
                    });
                    setShipperFormData({
                        shipperfullName:
                            res.data.commercial_data.shipper_Full_Name,
                        shipperemail: res.data.commercial_data.shipper_email,
                        shippermobileNumber:
                            res.data.commercial_data.shipper_mobile_number,
                        shipperphone: res.data.commercial_data.shipper_phone,
                        shipperaddressLine1:
                            res.data.commercial_data.shipper_addressLine1,
                        shipperaddressLine2:
                            res.data.commercial_data.shipper_addressLine2,
                        shipperpostalCode:
                            res.data.commercial_data.shipper_postalCode,
                        shippercountryCode:
                            res.data.commercial_data.shipper_countryCode,
                        shipperprovinceCode:
                            res.data.commercial_data.shipper_provincecode,
                        shippercity: res.data.commercial_data.shipper_city,
                        shippercompanyName:
                            res.data.commercial_data.shipper_companyName,
                        shipperstate: res.data.commercial_data.shipper_state,
                        shippercountry: res.data.commercial_data.shipper_country
                    });
                    setFormData({
                        fullName: res.data.commercial_data.receiver_Full_Name,
                        email: res.data.commercial_data.receiver_email,
                        mobileNumber:
                            res.data.commercial_data.receiver_mobile_number,
                        phone: res.data.commercial_data.receiver_phone,
                        addressLine1:
                            res.data.commercial_data.receiver_addressLine1,
                        addressLine2:
                            res.data.commercial_data.receiver_addressLine2,
                        postalCode: res.data.commercial_data.receiver_postalCode,
                        countryCode: res.data.commercial_data.receiver_countryCode,
                        provinceCode:
                            res.data.commercial_data.receiver_provincecode,
                        city: res.data.commercial_data.receiver_city,
                        companyName: res.data.commercial_data.receiver_companyName,
                        state: res.data.commercial_data.receiver_state,
                        country: res.data.commercial_data.receiver_country
                    });
                };

                if (checkIt === 'yes') {
                    if (name === "add-commercial") {
                        toggleActive();
                    } else if (name === "create-mother") {
                        setAPIMessage("MotherOrder Created");
                        toggleActive();
                        setSelectedRows([]);
                        togglePopoverActive();
                    } else if (name == "add-address") {
                        toggleActive();
                        handleChange();
                    } else if (name == "baby-delete") {
                        toggleActive();
                    }
                };

                setLoading(false);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        fetchAllBabyOrderlist();
    }, []);

    useEffect(() => {
        if (datas) {
            const orderNumbersArray = datas.map((item) => item.baby_order_number);
            setOrderNumbers(orderNumbersArray);
            const orderNumbersId = datas.map((item) => item.baby_order_id);
            setOrderId(orderNumbersId);
        }
    }, [datas]);

    const [disallowedCharactersError, setDisallowedCharactersError] = useState('');

    const handleChangethree = (field, value) => {
        const disallowedCharactersRegex = /[(){}\[\]!"'?]/;
        // Check if the input contains any disallowed characters
        if (disallowedCharactersRegex.test(value)) {
            setDisallowedCharactersError(`Error: The input cannot contain disallowed characters: (){}[]!"',.?`);
        } else {
            setDisallowedCharactersError('');
            setFormData((prevData) => ({
                ...prevData,
                [field]: value,
            }));

            setShipperFormData((prevData) => ({
                ...prevData,
                [field]: value,
            }));
            setCommercialForm((prevData) => ({
                ...prevData,
                [field]: value,
            }));
        }
    };

    const validationSchema = Yup.object().shape({
        fullName: Yup.string().required("Full Name is required"),
        email: Yup.string().email("Invalid email").required("Email is required"),
        mobileNumber: Yup.string().required("Mobile Number is required"),
        phone: Yup.string().required("phone is required"),
        addressLine1: Yup.string().required("Address Line 1 is required"),
        addressLine2: Yup.string().required("Address Line 2 is required"),
        postalCode: Yup.string().required("Postal Code is required"),
        countryCode: Yup.string().required("country code is required"),
        provinceCode: Yup.string().required("province code is required"),
        city: Yup.string().required("City is required"),
        companyName: Yup.string().required("company name is required"),
    });

    // items
    const [active2, setActive2] = useState(false);
    const [openCardIndex, setOpenCardIndex] = useState(null);

    // paginmation
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const paginatedData = parentBabyOrder && parentBabyOrder.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalItems = parentBabyOrder.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    // const rowMarkup = paginatedData.map(
    //     (
    //         {
    //             baby_order_number,
    //             baby_title,
    //             baby_total,
    //             baby_date,
    //             filePath,
    //             baby_ID,
    //             comercial_baby_pdf,
    //             shipmenttrackingnumber,
    //             trackingnumber,
    //             line_items
    //         },
    //         index
    //     ) => (
    //         <>
    //             <IndexTable.Row
    //                 id={index}
    //                 key={index}
    //                 selected={selectedResources.includes(index)}
    //                 position={index}
    //             >
    //                 <IndexTable.Cell>
    //                     <Text variant="bodyMd" fontWeight="bold" as="span">
    //                         #{baby_order_number}
    //                     </Text>
    //                 </IndexTable.Cell>
    //                 <IndexTable.Cell>
    //                     <Text variant="bodyMd" fontWeight="bold" as="span">
    //                         #{baby_ID}
    //                     </Text>
    //                 </IndexTable.Cell>
    //                 <IndexTable.Cell>
    //                     <Text variant="bodyMd" fontWeight="bold" as="span">
    //                         {baby_title}
    //                     </Text>
    //                 </IndexTable.Cell>
    //                 <IndexTable.Cell>{baby_date}</IndexTable.Cell>
    //                 <IndexTable.Cell> {typeof baby_total === 'number' ? baby_total.toFixed(1) : parseFloat(baby_total).toFixed(1)}</IndexTable.Cell>
    //                 <IndexTable.Cell>
    //                     <ButtonGroup>
    //                         {/* <Tooltip content="Print Invoice">
    //                               <div>
    //                                   <Icon
    //                                       source={PrintMajor}
    //                                       tone="base"
    //                                       color='success'
    //                                   />
    //                               </div>
    //                           </Tooltip> */}
    //                         <Tooltip content="Package Slip">
    //                             <div onClick={() => openUrl(filePath)}>
    //                                 <Icon source={ReceiptMajor} tone="base" color="base" />
    //                             </div>
    //                         </Tooltip>
    //                         <Tooltip content="Commercial Invoice">
    //                             <div
    //                                 onClick={() => {
    //                                     window.open(comercial_baby_pdf, "_blank");
    //                                 }}
    //                             >
    //                                 <Icon source={LegalMajor} tone="base" color="subdued" />
    //                             </div>
    //                         </Tooltip>
    //                         <Tooltip content="Add Tracking">
    //                             <div
    //                                 onClick={() =>
    //                                     openModal(shipmenttrackingnumber, trackingnumber)
    //                                 }
    //                             >
    //                                 <Icon source={LocationsMinor} tone="base" color="success" />
    //                             </div>
    //                         </Tooltip>
    //                     </ButtonGroup>
    //                 </IndexTable.Cell>
    //                 <IndexTable.Cell>
    //                     <Tooltip content="delete">
    //                         <Button
    //                             onClick={() => {
    //                                 // console.log(datas.mother_order_id);
    //                                 setBabyNumber(baby_ID);
    //                                 setIsDeleteModalOpen(!isDeleteModalOpen);
    //                             }}
    //                             destructive
    //                             size="micro"
    //                             accessibilityLabel="Delete"
    //                             icon={DeleteMajor}
    //                         ></Button>
    //                     </Tooltip>
    //                 </IndexTable.Cell>
    //                 <IndexTable.Cell>
    //                     <div>
    //                         <Popover active={openCardIndex === index} activator={<div
    //                             onClick={(e) => { e.stopPropagation(); handleCardClick(index); toggleActive2(); }}
    //                             style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
    //                         >
    //                             {Object.keys(line_items).length} items
    //                             <Icon source={DropdownMinor} color="base" />
    //                         </div>} onClose={toggleActive2}>
    //                             {openCardIndex === index && <Grid>
    //                                 <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 12 }}>
    //                                     <LegacyCard sectioned style={{ maxHeight: '300px', overflowY: 'auto' }}>
    //                                         <Badge progress="complete">Item List</Badge>
    //                                         {line_items.map((item, i) => (
    //                                             <div key={i}>
    //                                                 <div style={{ display: 'flex', marginTop: '15px', alignItems: 'center' }}>
    //                                                     <div style={{ marginLeft: '8px' }}>
    //                                                         <Thumbnail
    //                                                             source={item.product_images}
    //                                                             alt="Black choker necklace"
    //                                                         />
    //                                                     </div>
    //                                                     <div style={{ marginLeft: '8px', whiteSpace: 'normal' }}>
    //                                                         <Text style={{ whiteSpace: 'normal' }}>
    //                                                             {item.name} <br /><Text>price: {item.quantity} x {item.price}</Text>
    //                                                         </Text>
    //                                                     </div>
    //                                                 </div>
    //                                             </div>
    //                                         ))}
    //                                     </LegacyCard>
    //                                 </Grid.Cell>
    //                             </Grid>}
    //                         </Popover>
    //                     </div>
    //                 </IndexTable.Cell>
    //             </IndexTable.Row>
    //         </>
    //     )
    // );

    const [selectedBoxSize, setSelectedBoxSize] = useState("");
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

    const activator = (
        <Button
            disabled={parentBabyOrder.length === 0 ? true : false}
            pressed
            onClick={handleChange}
        >
            Add Address Details
        </Button>
    );

    const activator1 = (
        <Button
            disabled={parentBabyOrder.length === 0 ? true : false}
            pressed
            onClick={handleChanges}
        >
            Add Commercial Details
        </Button>
    );

    const handleSubmit = () => {

        setLoading(true);
        const selectedBabyOrderNumbers = [];
        const selectedBabyOrderIds = [];

        selectedResources.forEach((index) => {
            if (parentBabyOrder[index] && parentBabyOrder[index].parent_baby_order_id) {
                selectedBabyOrderNumbers.push(parentBabyOrder[index].parent_baby_order_id);
            }
        });
        selectedResources.forEach((index) => {
            if (parentBabyOrder[index] && parentBabyOrder[index].baby_order_id) {
                selectedBabyOrderIds.push(parentBabyOrder[index].baby_order_id);
            }
        });
        // console.log(selectedBabyOrderIds, "test...");
        const formDatas = new FormData();
        formDatas.append("baby_list", selectedBabyOrderNumbers);
        // formDatas.append("order_id", selectedBabyOrderIds);
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
        formDatas.append("shippercompanyName", shipperformData.shippercompanyName);
        formDatas.append("shipperselect", getselctId);

        for (const key in commercialForm) {
            if (commercialForm.hasOwnProperty(key)) {
                formDatas.append(key.toLowerCase(), commercialForm[key]);
            }
        }

        axios
            .post(
                `https://${BaseURl}/create_mother_order`,
                new URLSearchParams(formDatas)
            )
            .then((res) => {
                // console.log(res.data, "....619");
                if (res.status === 200) {
                    if (res.data.msg === "MotherOrder Created") {
                        handleSelectionChange();
                        fetchAllBabyOrderlist('yes', "create-mother");
                    } else {
                        setAPIMessage(res.data.msg);
                        setLoading(false);
                        toggleActive();
                        handleSelectionChange();
                        setSelectedRows([]);
                    }
                }
            })
            .catch((err) => { console.log(err); });
    };

    const DeleteSpecificMother = async () => {
        const formData = new FormData();
        formData.append("shop_name", shop);
        formData.append("baby_order_id", babynumber);
        setLoading(true);
        const response = await axios.post(
            `https://${BaseURl}/delete_specific_baby_order`,
            new URLSearchParams(formData)
        );
        if (response.status === 200) {
            // console.log(response.data);
            if (response.data.success === "Baby order is deleted") {
                handleSelectionChange();
                fetchAllBabyOrderlist('yes', 'baby-delete');
                setAPIMessage("Baby order is deleted")
                setIsDeleteModalOpen(false);
            }
        }
    };

    // commercial data post
    const commercialDataPost = async () => {
        const selectedBabyOrderNumbers = [];
        const selectedBabyOrderIds = [];
        setLoading(true);

        if (disallowedCharactersError == '') {
            if (!validateCommercialForm(commercialForm)) {
                // Handle error for commercialForm
                // console.log('Error: Some fields in commercialForm are empty');
                return;
            };
            selectedResources.forEach((index) => {
                if (datas[index] && datas[index].baby_order_number) {
                    selectedBabyOrderNumbers.push(datas[index].baby_order_number);
                }
            });
            selectedResources.forEach((index) => {
                if (datas[index] && datas[index].baby_order_id) {
                    selectedBabyOrderIds.push(datas[index].baby_order_id);
                }
            });
            const formData = new FormData();
            formData.append("shop_name", shop);
            for (const key in commercialForm) {
                if (commercialForm.hasOwnProperty(key)) {
                    formData.append(key.toLowerCase(), commercialForm[key]);
                }
            }
            const response = await axios.post(
                `https://${BaseURl}/get_comercial_detail`,
                new URLSearchParams(formData)
            );
            // console.log(response.data, "checl first");
            if (response.status === 200) {
                fetchAllBabyOrderlist('yes', "add-commercial");
                handleChanges();
                setAPIMessage("Commercial Details Add SuccessFully");
            }
        } else {
            console.log("error commercial data post");
        }

    };

    // Address data post 
    const addressDataPost = async () => {
        const selectedBabyOrderNumbers = [];
        const selectedBabyOrderIds = [];
        if (disallowedCharactersError == '') {
            if (!validateFormData(formData)) {
                // Handle error for formData
                // console.log('Error: Some fields in formData are empty');
                // alert('Error: Some fields in formData are empty');
                return;
            }

            if (!validateShipperFormData(shipperformData)) {
                // Handle error for shipperformData
                // console.log('Error: Some fields in shipperformData are empty');
                // alert('Error: Some fields in shipperformData are empty');
                return;
            }
            setLoading(true);

            selectedResources.forEach((index) => {
                if (datas[index] && datas[index].baby_order_number) {
                    selectedBabyOrderNumbers.push(datas[index].baby_order_number);
                }
            });
            selectedResources.forEach((index) => {
                if (datas[index] && datas[index].baby_order_id) {
                    selectedBabyOrderIds.push(datas[index].baby_order_id);
                }
            });
            const formDatass = new FormData();
            formDatass.append("shop_name", shop);
            formDatass.append("fullName", formData.fullName);
            formDatass.append("email", formData.email);
            formDatass.append("mobileNumber", formData.mobileNumber);
            formDatass.append("phone", formData.phone);
            formDatass.append("addressLine1", formData.addressLine1);
            formDatass.append("addressLine2", formData.addressLine2);
            formDatass.append("postalCode", formData.postalCode);
            formDatass.append("countryCode", formData.countryCode);
            formDatass.append("provinceCode", formData.provinceCode);
            formDatass.append("city", formData.city);
            formDatass.append("companyName", formData.companyName);
            formDatass.append("state", formData.state);
            formDatass.append("country", formData.country);
            formDatass.append("shipperFirstName", shipperformData.shipperfullName);
            formDatass.append("shipperemail", shipperformData.shipperemail);
            formDatass.append("shippermobileNumber", shipperformData.shippermobileNumber);
            formDatass.append("shipperphone", shipperformData.shipperphone);
            formDatass.append("shipperaddressLine1", shipperformData.shipperaddressLine1);
            formDatass.append("shipperaddressLine2", shipperformData.shipperaddressLine2);
            formDatass.append("shipperpostalcode", shipperformData.shipperpostalCode);
            formDatass.append("shippercountrycode", shipperformData.shippercountryCode);
            formDatass.append("shipperprovincecode", shipperformData.shipperprovinceCode);
            formDatass.append("shippercity", shipperformData.shippercity);
            formDatass.append("shippercompanyName", shipperformData.shippercompanyName);
            formDatass.append("shipperstate", shipperformData.shipperstate);
            formDatass.append("shippercountry", shipperformData.shippercountry);
            formDatass.append("shipperselect", getselctId);
            const response = await axios.post(`https://${BaseURl}/get_address_detail`, new URLSearchParams(formDatass));
            if (response.status === 200) {
                fetchAllBabyOrderlist('yes', "add-address");
                // handleChanges();
                setAPIMessage("Address Details Add SuccessFully");
            };
        } else {
            console.log("error");
        }
    };

    // delete parent baby orderdelete_specific_parent_baby_order/
    const deleteParentBabyorder = async (Id) => {
        const formData = new FormData();
        formData.append("shop_name", shop);
        formData.append("parent_baby_order_id", Id);
        setLoading(true);
        const response = await axios.post(`https://${BaseURl}/delete_specific_parent_baby_order`, new URLSearchParams(formData));
        if (response.status === 200) {
            // console.log(response.data, "delete parent baby..");
            fetchAllBabyOrderlist('yes', 'parent');
            setIsDeleteModalOpen(!isDeleteModalOpen)
        };
    };

    const [deleteParentId, setDeleteParentId] = useState('');

    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsScrolling(window.innerWidth < 1145);
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

    const [identifiersMatched, setIdentifiersMatched] = useState(false);

    useEffect(() => {

        const selectedResourcesTest = selectedResources;
        let isOk = true;

        for (let i = 1; i < selectedResourcesTest.length; i++) {
            const currentIndex = selectedResourcesTest[i];
            const previousIndex = selectedResourcesTest[i - 1];

            if (
                currentIndex < paginatedData.length &&
                previousIndex < paginatedData.length &&
                paginatedData[currentIndex]?.identifierID !== paginatedData[previousIndex]?.identifierID
            ) {
                isOk = false;
                break; // Exit the loop early if a mismatch is found
            }
        }

        if (isOk) {
            setIdentifiersMatched(false)
        } else {
            setIdentifiersMatched(true);
        }
    }, [paginatedData, selectedResources]);

    useEffect(() => {
        if (identifiersMatched) {
            setAPIMessage("You can only select Master Baby Order with same SID and PID");
            toggleActive();
        } else {
            setAPIMessage("");
            setToastMessage(false);
        }
    }, [identifiersMatched]);

    return (
        <Page>
            {loading && (
                <div className="spinner">
                <img src="https://i.stack.imgur.com/hzk6C.gif" alt="Loading..." />
           </div>
            )}
            <br />
            <ButtonGroup>
                <Formik
                    initialValues={{
                        fullName: "",
                        email: "",
                        mobileNumber: "",
                        phone: "",
                        addressLine1: "",
                        addressLine2: "",
                        postalCode: "",
                        countryCode: "",
                        provinceCode: "",
                        city: "",
                        companyName: "",
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
                            <ButtonGroup  >
                                <div style={{ display: "flex" }}>
                                    <div>
                                        <Popover
                                            active={""}
                                            activator={<Button pressed onClick={() => handleSubmit()} disabled={((parentBabyOrder.length === 0 || selectedResources.length === 0 || identifiersMatched)) ? true : false}>CREATE MOTHER ORDER</Button>}
                                            onClose={togglePopoverActive}
                                            ariaHaspopup={false}
                                            sectioned
                                        >
                                            <FormLayout>
                                                <Select value={selectedBoxSize}
                                                    onChange={handleSelectChange}
                                                    label="Box Sizes:"
                                                    options={[
                                                        "COAT BOXES - 40 x 26 x 10",
                                                        "SWEATER BOXES - 37 x 30 x 6",
                                                        "SHOULDER BAG BOXES - 36 x 22 x 11",
                                                        "MINI BAG BOX - 28 x 20 x 8",
                                                    ]} />
                                                <Button primary size="slim" onClick={handleSubmit}>Add Baby Order</Button>
                                            </FormLayout>
                                        </Popover>
                                    </div>&nbsp;&nbsp;
                                    <div>
                                        <Modal
                                            activator={activator}
                                            open={active}
                                            onClose={handleChange}
                                            title="Address Details"
                                            primaryAction={{
                                                content: "Add Address",
                                                onAction: addressDataPost,
                                            }}
                                        >
                                            <div style={{ marginLeft: "20px", marginTop: "20px" }}>
                                                <Text variant="headingLg" as="h5">
                                                    Receiver Details
                                                </Text>
                                            </div>

                                            <Modal.Section>
                                                <FormLayout>
                                                    <FormLayout.Group>
                                                        <div className="form-field">
                                                            <label>Full Name</label>
                                                            <TextField
                                                                type="text"
                                                                name="fullName"
                                                                error={(formData.fullName ? '' : 'This Field Is Required')}
                                                                value={formData.fullName}
                                                                onChange={(value) =>
                                                                    handleChangethree("fullName", value)
                                                                }
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Email</label>
                                                            <TextField
                                                                error={(formData.email ? '' : 'This Field Is Required')}
                                                                type="text"
                                                                name="email"
                                                                value={formData.email}
                                                                onChange={(value) =>
                                                                    handleChangethree("email", value)
                                                                }
                                                            />
                                                            {!formData.email && (
                                                                <ErrorMessage
                                                                    name="email"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Mobile Number</label>
                                                            <TextField
                                                                error={
                                                                    formData.mobileNumber
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="mobileNumber"
                                                                value={formData.mobileNumber}
                                                                onChange={(value) =>
                                                                    handleChangethree("mobileNumber", value)
                                                                }
                                                            />
                                                            {!formData.mobileNumber && (
                                                                <ErrorMessage
                                                                    name="mobileNumber"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Phone</label>
                                                            <TextField
                                                                error={formData.phone ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="phone"
                                                                value={formData.phone}
                                                                onChange={(value) =>
                                                                    handleChangethree("phone", value)
                                                                }
                                                            />
                                                            {!formData.phone && (
                                                                <ErrorMessage
                                                                    name="phone"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="form-field">
                                                            <label>Address Line1</label>
                                                            <TextField
                                                                error={
                                                                    formData.addressLine1
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="addressLine1"
                                                                value={formData.addressLine1}
                                                                onChange={(value) =>
                                                                    handleChangethree("addressLine1", value)
                                                                }
                                                            />
                                                            {!formData && (
                                                                <ErrorMessage
                                                                    name="addressLine1"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="form-field">
                                                            <label>Address Line2</label>
                                                            <TextField
                                                                error={
                                                                    formData.addressLine2
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="addressLine2"
                                                                value={formData.addressLine2}
                                                                onChange={(value) =>
                                                                    handleChangethree("addressLine2", value)
                                                                }
                                                            />
                                                            {!formData && (
                                                                <ErrorMessage
                                                                    name="addressLine2"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="form-field">
                                                            <label>Postal Code</label>
                                                            <TextField
                                                                error={
                                                                    formData.fullName ? "" : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="postalCode"
                                                                value={formData.postalCode}
                                                                onChange={(value) =>
                                                                    handleChangethree("postalCode", value)
                                                                }
                                                            />
                                                            {!formData && (
                                                                <ErrorMessage
                                                                    name="postalCode"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="form-field">
                                                            <label>Country Code </label>
                                                            <TextField
                                                                error={
                                                                    formData.countryCode ? "" : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="countryCode"
                                                                value={formData.countryCode}
                                                                onChange={(value) =>
                                                                    handleChangethree("countryCode", value)
                                                                }
                                                            />
                                                            {!formData && (
                                                                <ErrorMessage
                                                                    name="countryCode"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Province Code</label>
                                                            <TextField
                                                                error={
                                                                    formData.provinceCode
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="provinceCode"
                                                                value={formData.provinceCode}
                                                                onChange={(value) =>
                                                                    handleChangethree("provinceCode", value)
                                                                }
                                                            />
                                                            {formData && (
                                                                <ErrorMessage
                                                                    name="provinceCode"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="form-field">
                                                            <label>City</label>
                                                            <TextField
                                                                error={formData.city ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="city"
                                                                value={formData.city}
                                                                onChange={(value) => handleChangethree("city", value)}
                                                            />
                                                            {!formData && (
                                                                <ErrorMessage
                                                                    name="city"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="form-field">
                                                            <label>State</label>
                                                            <TextField
                                                                error={formData.state ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="state"
                                                                value={formData.state}
                                                                onChange={(value) => handleChangethree("state", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Country</label>
                                                            <TextField
                                                                error={
                                                                    formData.country ? "" : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="country"
                                                                value={formData.country}
                                                                onChange={(value) =>
                                                                    handleChangethree("country", value)
                                                                }
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Company Name</label>
                                                            <TextField
                                                                error={
                                                                    formData.companyName ? "" : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="country"
                                                                value={formData.companyName}
                                                                onChange={(value) =>
                                                                    handleChangethree("companyName", value)
                                                                }
                                                            />
                                                        </div>
                                                    </FormLayout.Group>
                                                </FormLayout>
                                            </Modal.Section>
                                            <div style={{ marginLeft: "20px", marginTop: "20px" }}>
                                                <Text variant="headingLg" as="h5">
                                                    Shipper Details
                                                </Text>
                                            </div>
                                            <Modal.Section>
                                                <FormLayout>
                                                    <FormLayout.Group>
                                                        <div className="form-field">
                                                            <label>Full Name</label>
                                                            <TextField
                                                                type="text"
                                                                name="shipperfullName"
                                                                error={
                                                                    shipperformData.shipperfullName
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                value={shipperformData.shipperfullName}
                                                                onChange={(value) =>
                                                                    handleChangethree("shipperfullName", value)
                                                                }
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Email</label>
                                                            <TextField
                                                                error={
                                                                    shipperformData.shipperemail
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="shipperemail"
                                                                value={shipperformData.shipperemail}
                                                                onChange={(value) =>
                                                                    handleChangethree("shipperemail", value)
                                                                }
                                                            />
                                                            {!shipperformData.shipperemail && (
                                                                <ErrorMessage
                                                                    name="shipperemail"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Mobile Number</label>
                                                            <TextField
                                                                error={
                                                                    shipperformData.shippermobileNumber
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="shippermobileNumber"
                                                                value={shipperformData.shippermobileNumber}
                                                                onChange={(value) =>
                                                                    handleChangethree("shippermobileNumber", value)
                                                                }
                                                            />
                                                            {!shipperformData.shippermobileNumber && (
                                                                <ErrorMessage
                                                                    name="shippermobileNumber"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Phone</label>
                                                            <TextField
                                                                error={
                                                                    shipperformData.shipperphone
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="shipperphone"
                                                                value={shipperformData.shipperphone}
                                                                onChange={(value) =>
                                                                    handleChangethree("shipperphone", value)
                                                                }
                                                            />
                                                            {!shipperformData.shipperphone && (
                                                                <ErrorMessage
                                                                    name="shipperphone"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="form-field">
                                                            <label>Address Line1</label>
                                                            <TextField
                                                                error={
                                                                    shipperformData.shipperaddressLine1
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="shipperaddressLine1"
                                                                value={shipperformData.shipperaddressLine1}
                                                                onChange={(value) =>
                                                                    handleChangethree("shipperaddressLine1", value)
                                                                }
                                                            />
                                                            {!shipperformData.shipperaddressLine1 && (
                                                                <ErrorMessage
                                                                    name="shipperaddressLine1"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="form-field">
                                                            <label>Address Line2</label>
                                                            <TextField
                                                                error={
                                                                    shipperformData.shipperaddressLine2
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="shipperaddressLine2"
                                                                value={shipperformData.shipperaddressLine2}
                                                                onChange={(value) =>
                                                                    handleChangethree("shipperaddressLine2", value)
                                                                }
                                                            />
                                                            {!shipperformData && (
                                                                <ErrorMessage
                                                                    name="shipperaddressLine2"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="form-field">
                                                            <label>Postal Code </label>
                                                            <TextField
                                                                error={
                                                                    shipperformData.shipperpostalCode
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="shipperpostalCode"
                                                                value={shipperformData.shipperpostalCode}
                                                                onChange={(value) =>
                                                                    handleChangethree("shipperpostalCode", value)
                                                                }
                                                            />
                                                            {!shipperformData && (
                                                                <ErrorMessage
                                                                    name="shipperpostalCode"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="form-field">
                                                            <label>Country Code </label>
                                                            <TextField
                                                                error={
                                                                    shipperformData.shippercountryCode
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="shippercountryCode"
                                                                value={shipperformData.shippercountryCode}
                                                                onChange={(value) =>
                                                                    handleChangethree("shippercountryCode", value)
                                                                }
                                                            />
                                                            {!shipperformData && (
                                                                <ErrorMessage
                                                                    name="shippercountryCode"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="form-field">
                                                            <label>Province Code</label>
                                                            <TextField
                                                                error={
                                                                    shipperformData.shipperprovinceCode
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="shipperprovinceCode"
                                                                value={shipperformData.shipperprovinceCode}
                                                                onChange={(value) =>
                                                                    handleChangethree("shipperprovinceCode", value)
                                                                }
                                                            />
                                                            {shipperformData && (
                                                                <ErrorMessage
                                                                    name="shipperprovinceCode"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="form-field">
                                                            <label>City</label>
                                                            <TextField
                                                                error={
                                                                    shipperformData.shippercity
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="shippercity"
                                                                value={shipperformData.shippercity}
                                                                onChange={(value) =>
                                                                    handleChangethree("shippercity", value)
                                                                }
                                                            />
                                                            {!shipperformData && (
                                                                <ErrorMessage
                                                                    name="shippercity"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>

                                                        <div className="form-field">
                                                            <label>State</label>
                                                            <TextField
                                                                error={shipperformData.shipperstate ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="state"
                                                                value={shipperformData.shipperstate}
                                                                onChange={(value) => handleChangethree("shipperstate", value)}
                                                            />
                                                        </div>

                                                        <div className="form-field">
                                                            <label>Country</label>
                                                            <TextField
                                                                error={
                                                                    shipperformData.shippercountry ? "" : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="country"
                                                                value={shipperformData.shippercountry}
                                                                onChange={(value) =>
                                                                    handleChangethree("shippercountry", value)
                                                                }
                                                            />
                                                        </div>

                                                        <div className="form-field">
                                                            <label>FROM BBX COMPANY</label>
                                                            <TextField
                                                                error={
                                                                    shipperformData.shippercompanyName
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="shippercompanyName"
                                                                value={shipperformData.shippercompanyName}
                                                                onChange={(value) =>
                                                                    handleChangethree("shippercompanyName", value)
                                                                }
                                                            />
                                                            {!shipperformData && (
                                                                <ErrorMessage
                                                                    name="shippercompanyName"
                                                                    component="div"
                                                                    className="error-message"
                                                                />
                                                            )}
                                                        </div>

                                                        {/* <div className="form-field">
                        <Select
                          value={selectedBoxSize}
                          onChange={handleSelectChange}
                          label="Box Sizes:"
                          options={[
                            "COAT BOXES - 40 x 26 x 10",
                            "SWEATER BOXES - 37 x 30 x 6",
                            "SHOULDER BAG BOXES - 36 x 22 x 11",
                            "MINI BAG BOX - 28 x 20 x 8",
                          ]}
                        />
                      </div> */}
                                                    </FormLayout.Group>
                                                </FormLayout>
                                            </Modal.Section>
                                        </Modal>&nbsp;&nbsp;
                                        <Modal
                                            activator={activator1}
                                            open={actives}
                                            onClose={handleChanges}
                                            title="Commercial Details"
                                            titletwo="add data"
                                            primaryAction={{
                                                content: "Add Details",
                                                onAction: commercialDataPost,
                                            }}
                                        >
                                            <Modal.Section>
                                                <FormLayout>
                                                    <FormLayout.Group>
                                                        <div className="form-field">
                                                            <label>Reference Number</label>
                                                            <TextField
                                                                type="text"
                                                                name="REFERENCE_NUMBER"
                                                                error={
                                                                    commercialForm.REFERENCE_NUMBER
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                value={commercialForm.REFERENCE_NUMBER}
                                                                onChange={(value) =>
                                                                    handleChangethree("REFERENCE_NUMBER", value)
                                                                }
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Shipper Export Reference</label>
                                                            <TextField
                                                                error={
                                                                    commercialForm.SHIPPER_EXPORT_REFERENCES
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="SHIPPER_EXPORT_REFERENCES"
                                                                value={commercialForm.SHIPPER_EXPORT_REFERENCES}
                                                                onChange={(value) =>
                                                                    handleChangethree(
                                                                        "SHIPPER_EXPORT_REFERENCES",
                                                                        value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        {/* <div className="form-field">
                                                            <label>Shipper</label>
                                                            <TextField
                                                                error={
                                                                    commercialForm.SHIPPER
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="SHIPPER"
                                                                value={commercialForm.SHIPPER}
                                                                onChange={(value) =>
                                                                    handleChangethree("SHIPPER", value)
                                                                }
                                                            />
                                                        </div> */}

                                                        <div className="form-field">
                                                            <label>Country Of Export</label>
                                                            <TextField
                                                                error={
                                                                    commercialForm.COUNTRY_OF_EXPORT
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="COUNTRY_OF_EXPORT"
                                                                value={commercialForm.COUNTRY_OF_EXPORT}
                                                                onChange={(value) =>
                                                                    handleChangethree("COUNTRY_OF_EXPORT", value)
                                                                }
                                                            />
                                                        </div>
                                                        {/* <div className="form-field">
                                                            <label>Importer</label>
                                                            <TextField
                                                                error={
                                                                    commercialForm.IMPORTER
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="IMPORTER"
                                                                value={commercialForm.IMPORTER}
                                                                onChange={(value) =>
                                                                    handleChangethree("IMPORTER", value)
                                                                }
                                                            />
                                                        </div> */}
                                                        {/* <div className="form-field">
                                                            <label>Indirect Representative </label>
                                                            <TextField
                                                                error={
                                                                    commercialForm.INDIRECT_REPRESENTATIVE
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="INDIRECT_REPRESENTATIVE"
                                                                value={commercialForm.INDIRECT_REPRESENTATIVE}
                                                                onChange={(value) =>
                                                                    handleChangethree("INDIRECT_REPRESENTATIVE", value)
                                                                }
                                                            />
                                                        </div> */}
                                                        <div className="form-field">
                                                            <label>Reason For Export </label>
                                                            <TextField
                                                                error={
                                                                    commercialForm.REASON_FOR_EXPORT
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="REASON_FOR_EXPORT"
                                                                value={commercialForm.REASON_FOR_EXPORT}
                                                                onChange={(value) =>
                                                                    handleChangethree("REASON_FOR_EXPORT", value)
                                                                }
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Country Of Ultimate Destination</label>
                                                            <TextField
                                                                error={
                                                                    commercialForm.COUNTRY_OF_ULTIMATE_DESTINATION
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="COUNTRY_OF_ULTIMATE_DESTINATION"
                                                                value={commercialForm.COUNTRY_OF_ULTIMATE_DESTINATION}
                                                                onChange={(value) =>
                                                                    handleChangethree(
                                                                        "COUNTRY_OF_ULTIMATE_DESTINATION",
                                                                        value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Tax Id</label>
                                                            <TextField
                                                                error={
                                                                    commercialForm.tax_id
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="tax_id"
                                                                value={commercialForm.tax_id}
                                                                onChange={(value) =>
                                                                    handleChangethree("tax_id", value)
                                                                }
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>EORI Id</label>
                                                            <TextField
                                                                error={
                                                                    commercialForm.EORI_Id
                                                                        ? ""
                                                                        : "This Field Is Required"
                                                                }
                                                                type="text"
                                                                name="EORI_Id"
                                                                value={commercialForm.EORI_Id}
                                                                onChange={(value) =>
                                                                    handleChangethree(
                                                                        "EORI_Id",
                                                                        value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </FormLayout.Group>
                                                    <div style={{ marginLeft: "0px", marginTop: "20px" }}>
                                                        <Text variant="headingLg" as="h5">
                                                            Consignee Details
                                                        </Text>
                                                    </div>
                                                    <FormLayout.Group>
                                                        <div className="form-field">
                                                            <label>Full Name</label>
                                                            <TextField
                                                                error={commercialForm.consignee_fullName ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="fullName"
                                                                value={commercialForm.consignee_fullName}
                                                                onChange={(value) => handleChangethree("consignee_fullName", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Email</label>
                                                            <TextField
                                                                error={commercialForm.consignee_email ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="email"
                                                                value={commercialForm.consignee_email}
                                                                onChange={(value) => handleChangethree("consignee_email", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Mobile Number</label>
                                                            <TextField
                                                                error={commercialForm.consignee_mobile_number ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="mobile_number"
                                                                value={commercialForm.consignee_mobile_number}
                                                                onChange={(value) => handleChangethree("consignee_mobile_number", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Phone</label>
                                                            <TextField
                                                                error={commercialForm.consignee_phone ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="phone"
                                                                value={commercialForm.consignee_phone}
                                                                onChange={(value) => handleChangethree("consignee_phone", value)}
                                                            />
                                                        </div>

                                                        <div className="form-field">
                                                            <label>Address</label>
                                                            <TextField
                                                                error={commercialForm.consignee_address ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="address"
                                                                value={commercialForm.consignee_address}
                                                                onChange={(value) => handleChangethree("consignee_address", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Address Line 2</label>
                                                            <TextField
                                                                error={commercialForm.consignee_addressLine2 ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="addressLine2"
                                                                value={commercialForm.consignee_addressLine2}
                                                                onChange={(value) => handleChangethree("consignee_addressLine2", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>PinCode</label>
                                                            <TextField
                                                                error={commercialForm.consignee_pincode ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="pincode"
                                                                value={commercialForm.consignee_pincode}
                                                                onChange={(value) => handleChangethree("consignee_pincode", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Country Code</label>
                                                            <TextField
                                                                error={commercialForm.consignee_countryCode ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="countryCode"
                                                                value={commercialForm.consignee_countryCode}
                                                                onChange={(value) => handleChangethree("consignee_countryCode", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Province Code</label>
                                                            <TextField
                                                                error={commercialForm.consignee_provincecode ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="provincecode"
                                                                value={commercialForm.consignee_provincecode}
                                                                onChange={(value) => handleChangethree("consignee_provincecode", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>State</label>
                                                            <TextField
                                                                error={commercialForm.consignee_state ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="state"
                                                                value={commercialForm.consignee_state}
                                                                onChange={(value) => handleChangethree("consignee_state", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Country</label>
                                                            <TextField
                                                                error={commercialForm.consignee_country ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="country"
                                                                value={commercialForm.consignee_country}
                                                                onChange={(value) => handleChangethree("consignee_country", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>City</label>
                                                            <TextField
                                                                error={commercialForm.consignee_city ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="city"
                                                                value={commercialForm.consignee_city}
                                                                onChange={(value) => handleChangethree("consignee_city", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Company Name</label>
                                                            <TextField
                                                                error={commercialForm.consignee_companyName ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="companyName"
                                                                value={commercialForm.consignee_companyName}
                                                                onChange={(value) => handleChangethree("consignee_companyName", value)}
                                                            />
                                                        </div>

                                                    </FormLayout.Group>
                                                    <div style={{ marginLeft: "0px", marginTop: "20px" }}>
                                                        <Text variant="headingLg" as="h5">
                                                            Indirect Representative
                                                        </Text>
                                                    </div>
                                                    <FormLayout.Group>
                                                        <div className="form-field">
                                                            <label>Name</label>
                                                            <TextField
                                                                error={commercialForm.REPRESENTATIVE_NAME ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="REPRESENTATIVE_NAME"
                                                                value={commercialForm.REPRESENTATIVE_NAME}
                                                                onChange={(value) => handleChangethree("REPRESENTATIVE_NAME", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Address</label>
                                                            <TextField
                                                                error={commercialForm.REPRESENTATIVE_ADDRESS ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="REPRESENTATIVE_ADDRESS"
                                                                value={commercialForm.REPRESENTATIVE_ADDRESS}
                                                                onChange={(value) => handleChangethree("REPRESENTATIVE_ADDRESS", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>State</label>
                                                            <TextField
                                                                error={commercialForm.REPRESENTATIVE_STATE ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="REPRESENTATIVE_STATE"
                                                                value={commercialForm.REPRESENTATIVE_STATE}
                                                                onChange={(value) => handleChangethree("REPRESENTATIVE_STATE", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Country</label>
                                                            <TextField
                                                                error={commercialForm.REPRESENTATIVE_COUNTRY ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="REPRESENTATIVE_COUNTRY"
                                                                value={commercialForm.REPRESENTATIVE_COUNTRY}
                                                                onChange={(value) => handleChangethree("REPRESENTATIVE_COUNTRY", value)}
                                                            />
                                                        </div>
                                                        <div className="form-field">
                                                            <label>Postal Code</label>
                                                            <TextField
                                                                error={commercialForm.REPRESENTATIVE_ZIPCODE ? "" : "This Field Is Required"}
                                                                type="text"
                                                                name="REPRESENTATIVE_ZIPCODE"
                                                                value={commercialForm.REPRESENTATIVE_ZIPCODE}
                                                                onChange={(value) => handleChangethree("REPRESENTATIVE_ZIPCODE", value)}
                                                            />
                                                        </div>

                                                    </FormLayout.Group>
                                                </FormLayout>
                                            </Modal.Section>
                                        </Modal>&nbsp;&nbsp;
                                        <Modal
                                            open={isModalOpen}
                                            onClose={closeModal}
                                            title="Add Tracking"
                                            secondaryActions={[
                                                {
                                                    content: "Close",
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
                                    </div>
                                </div>
                            </ButtonGroup>
                        </Form>
                    )}
                </Formik>
            </ButtonGroup>
            <br />
            {parentBabyOrder.length === 0 ? (
                <div style={{ marginLeft: "20px", marginBottom: "10px" }}>
                    <Banner title="Parent Baby Order Lists">
                        <p>No Parent baby order created yet ...!!</p>
                    </Banner>
                </div>
            ) : (
                <div className="Polaris-LegacyCard" style={{ width: isScrolling ? 'auto' : '117%' }}>
                    <div className="Polaris-LegacyCard__Header" ><h2 className="Polaris-Text--root Polaris-Text--headingMd">Master Baby order Lists</h2></div>
                    <div className="Polaris-IndexTable">
                        <div className="Polaris-IndexTable__IndexTableWrapper Polaris-IndexTable__IndexTableWrapper--scrollBarHidden">
                            <div className="Polaris-IndexTable-ScrollContainer">
                                <table className={`Polaris-IndexTable__Table Polaris-IndexTable__Table--sticky ${isScrolling ? 'Polaris-IndexTable__Table--scrolling' : ''}`}>
                                    <thead>
                                        <tr>
                                            <th className="Polaris-IndexTable__TableHeading Polaris-IndexTable__TableHeading--first" data-index-table-heading="true">
                                                {/* Add header content */}
                                            </th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Order Number</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Parent Order Number</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Babies Details</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Date</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Total</th>
                                            <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Options</th>
                                            {/* <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Action</th> */}
                                            {/* <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true"></th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedData && paginatedData.map((datas, index) => {
                                            return (
                                                <>
                                                    <tr className="Polaris-IndexTable__TableRow">
                                                        <td className="Polaris-IndexTable__TableCell Polaris-IndexTable__TableHeading--first">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedResources.includes(index)}
                                                                onChange={() => {
                                                                    const updatedSelectedRows = [...selectedResources];
                                                                    if (selectedResources.includes(index)) {
                                                                        updatedSelectedRows.splice(updatedSelectedRows.indexOf(index), 1);
                                                                    } else {
                                                                        updatedSelectedRows.push(index);
                                                                    }
                                                                    setSelectedRows(updatedSelectedRows);
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="Polaris-IndexTable__TableCell">#{datas.parent_order_number}</td>
                                                        <td className="Polaris-IndexTable__TableCell">#{datas.parent_baby_order_id}</td>
                                                        <td className="Polaris-IndexTable__TableCell">{datas.parent_baby_order_number} <br />{datas.PID} <br />{datas.SID} </td>
                                                        <td className="Polaris-IndexTable__TableCell">{datas.parent_baby_order_date}</td>
                                                        <td className="Polaris-IndexTable__TableCell">{datas.price}</td>
                                                        <td className="Polaris-IndexTable__TableCell">
                                                            <ButtonGroup>
                                                                <Tooltip content="Package Slip">
                                                                    <div onClick={() => {
                                                                        window.open(datas.filePath, "_blank")
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
                                                                        window.open(datas.comercial_parent_baby_pdf, "_blank")
                                                                    }}>
                                                                        <Icon
                                                                            source={LegalMajor}
                                                                            tone="base"
                                                                            color='subdued'
                                                                        />
                                                                    </div>
                                                                </Tooltip> */}
                                                                <Tooltip content="Tracking Info">
                                                                    <div onClick={() => {
                                                                        setIsModalOpen(true);
                                                                        setAddTracking(datas.trackingnumber);
                                                                        setShipmenttrackingnumber(datas.shipmenttrackingnumber);
                                                                    }}>
                                                                        <Icon
                                                                            source={LocationsMinor}
                                                                            tone="base"
                                                                            color='success'
                                                                        />
                                                                    </div>
                                                                </Tooltip>
                                                            </ButtonGroup>
                                                        </td>
                                                        {/* <td className="Polaris-IndexTable__TableCell">
                                                            <Tooltip content="delete">
                                                                <Button onClick={() => {
                                                                    setDeleteParentId(datas.parent_baby_order_id);
                                                                    setIsDeleteModalOpen(!isDeleteModalOpen);
                                                                }} destructive size='micro' accessibilityLabel='Delete' icon={DeleteMajor}></Button>
                                                            </Tooltip>

                                                        </td> */}
                                                        {/* <td onClick={() => {
                                                            toggleCollapsible(index);
                                                        }} className="Polaris-IndexTable__TableCell">
                                                            {collapsibleStates[index] ? <Icon
                                                                source={ChevronUpMinor}
                                                                tone="base"
                                                            /> : <Icon
                                                                source={ChevronDownMinor}
                                                                tone="base"
                                                            />}
                                                        </td> */}

                                                    </tr>
                                                    {/* {collapsibleStates[index] && */}
                                                    <tr className={`Polaris-IndexTable__TableRow ${collapsibleStates[index] ? 'collapsible-open' : ''
                                                        }`} style={{
                                                            // height: datas.baby_order_data.length < 4 ? datas.baby_order_data.length === 1 ? `${datas.baby_order_data.length * 73}px` : `${datas.baby_order_data.length * 55}px` : `${datas.baby_order_data.length * 42.4285714286}px` 
                                                            height: `${(datas.baby_order_data.length + 1) * 37}px`
                                                        }}>
                                                        <div className="Polaris-LegacyCard" style={{ display: "contents" }}>
                                                            <table style={{ position: "absolute" }} className="Polaris-IndexTable__Table Polaris-IndexTable__Table--sticky">
                                                                <thead>
                                                                    <tr>
                                                                        <th className="Polaris-IndexTable__TableHeading Polaris-IndexTable__TableHeading--first" data-index-table-heading="true">

                                                                        </th>
                                                                        <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Baby Number</th>
                                                                        {/* <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Title</th> */}
                                                                        <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Date</th>
                                                                        <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Total</th>
                                                                        <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Box</th>
                                                                        <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Actions</th>
                                                                        <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Items</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {datas.baby_order_data.map((data1, indexs) =>
                                                                        <tr style={{ backgroundColor: "#ebebeb" }} id={indexs} className="Polaris-IndexTable__TableRow">
                                                                            <td className="Polaris-IndexTable__TableCell  Polaris-IndexTable__TableHeading--first">

                                                                            </td>
                                                                            <td className="Polaris-IndexTable__TableCell">#{data1.baby_ID}</td>
                                                                            {/* <td className="Polaris-IndexTable__TableCell">{data1.baby_title}</td> */}
                                                                            <td className="Polaris-IndexTable__TableCell">{data1.baby_date}</td>
                                                                            <td className="Polaris-IndexTable__TableCell">{data1.baby_total}</td>
                                                                            <td className="Polaris-IndexTable__TableCell">{data1.box_type}</td>
                                                                            <td className="Polaris-IndexTable__TableCell">
                                                                                <ButtonGroup>
                                                                                    <Tooltip content="Package Slip">
                                                                                        <div onClick={() => {
                                                                                            window.open(data1.filePath, "_blank")
                                                                                        }}>
                                                                                            <Icon
                                                                                                source={ReceiptMajor}
                                                                                                tone="base"
                                                                                                color='base'
                                                                                            />
                                                                                        </div>
                                                                                    </Tooltip>
                                                                                    <Tooltip content="Tracking Info">
                                                                                        <div onClick={() => {
                                                                                            setIsModalOpen1(true);
                                                                                            setAddTracking1(data1.trackingnumber);
                                                                                            setShipmenttrackingnumber1(data1.shipmenttrackingnumber);
                                                                                        }}>
                                                                                            <Icon
                                                                                                source={LocationsMinor}
                                                                                                tone="base"
                                                                                                color='success'
                                                                                            />
                                                                                        </div>
                                                                                    </Tooltip>
                                                                                </ButtonGroup>
                                                                            </td>
                                                                            <td className="clasPolaris-IndexTable__TableCell">
                                                                                <ActionListInPopoverExample fulfillmentStatus={[]}
                                                                                    itemsdata={data1.line_items}
                                                                                    quantity={data1.item_quantity}
                                                                                    Item='ITEMS' />
                                                                            </td>

                                                                        </tr>
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </tr>
                                                    {/* } */}
                                                </>
                                            )
                                        })}
                                    </tbody>
                                </table>
                                {deleteParentId && <Modal
                                    open={isDeleteModalOpen}
                                    onClose={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
                                    title="Delete Confirmation"
                                    primaryAction={{
                                        content: 'Delete',
                                        onAction: () => deleteParentBabyorder(deleteParentId),
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
                                            <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                                                Are you sure you want to delete the baby order #{deleteParentId}?</p>
                                        </TextContainer>
                                    </Modal.Section>
                                </Modal>}
                                <div className="Polaris-IndexTable__TableRow"></div>
                                {/* <div style={{ display: "flex", justifyContent: "center", paddingBottom: "10px", paddingTop: "10px" }}>

                                </div> */}
                            </div>
                        </div>
                    </div>
                    {/* <div class="Polaris-IndexTable__ScrollBarContainer"><div class="Polaris-IndexTable__ScrollBar" style={{'--pc-index-table-scroll-bar-content-width': '635px'}}><div class="Polaris-IndexTable__ScrollBarContent"></div></div></div> */}
                    {parentBabyOrder.length > 9 && <div style={{ display: "flex", justifyContent: "center", paddingBottom: "10px", paddingTop: "10px" }}>
                        <Pagination
                            hasPrevious={currentPage > 1}
                            hasNext={currentPage < totalPages}
                            label={`${paginatedData.length} of ${parentBabyOrder.length}`}
                            onPrevious={() => handlePageChange(currentPage - 1)}
                            onNext={() => handlePageChange(currentPage + 1)}
                        />
                    </div>}
                </div>
            )}
            {/* <Modal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
                title="Delete Confirmation"
                primaryAction={{
                    content: 'Delete',
                    onAction: () => deleteParentBabyorder(deleteParentId),
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
                        <p style={{ fontSize: '15px', fontWeight: 'bold' }}>
                            Are you sure you want to delete the baby order #{deleteParentId}?</p>
                    </TextContainer>
                </Modal.Section>
            </Modal> */}
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
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
                title="Delete Confirmation"
                primaryAction={{
                    content: "Delete",
                    onAction: () => DeleteSpecificMother(),
                }}
                secondaryActions={[
                    {
                        content: "Cancel",
                        onAction: () => setIsDeleteModalOpen(!isDeleteModalOpen),
                    },
                ]}
                size="small"
            >
                <Modal.Section>
                    <TextContainer>
                        <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                            Are you sure you want to delete the baby order #{babynumber}?
                        </p>
                    </TextContainer>
                </Modal.Section>
            </Modal>
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
            <div id="toast-message">
                <Frame>
                    {toastMarkup}
                </Frame>
            </div>
        </Page>
    );

};
