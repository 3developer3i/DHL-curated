import { useState } from "react";
import { ModalContext } from "./modalContext";

export default function ModalState(props) {

    const [trackingNumbers, setTrackingNumbers] = useState(['']);
    const [babyorderlists, setBabyorderlists] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [remainsproducts, setRemainsproducts] = useState();
    const [deselectitem, setDeselectitem] = useState([]);
    // baby order states
    const [babyorderdata, setBabyOrderData] = useState([]);
    const [babyordernumber, setBabyOrderNumber] = useState("");
    const [uniqOrderId, setUniqOrderId] = useState("");
    const [order_list, setOrder_List] = useState([]);
    const [trackingId, setTrackingId] = useState("");
    const [lineItemsData, setLineItemsData] = useState(null); // New state variable
    const [tableData, setTableData] = useState([]);

    // open mother state
    const [openmotherorder, setMotherOrder] = useState(false);
    const [sub_order, setSub_order] = useState();
    const [orderlength, setOrderLength] = useState("");
    const [opentable, setOpenTable] = useState(false);

    // ParentBaby Order State
    const [parentBabyOrder, setParentBabyOrder] = useState([]);
    const [motherOrderData, setMotherOrderData] = useState([]);
    const [callApiParentBaby, setCallApiParentBaby] = useState(false);
    // Initialize a state variable to hold the baby IDs
    const [babyIDs, setBabyIDs] = useState([]);
    const [babyOrderIDs, setBabyOrderIDs] = useState([]);

    const [run, setRun] = useState(false);
    const [extraData, setExtraData] = useState([]);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [ShowTable1, setShowtable] = useState(false);

    return (
        <ModalContext.Provider value={{ callApiParentBaby, babyOrderIDs, setBabyOrderIDs, babyIDs, setBabyIDs, setCallApiParentBaby, parentBabyOrder, setParentBabyOrder, setDeleteIndex, ShowTable1, setShowtable, isLoading, setIsLoading, deleteIndex, setOrderLength, setExtraData, extraData, run, setRun, motherOrderData, setTableData, tableData, lineItemsData, setLineItemsData, setMotherOrderData, setOpenTable, opentable, orderlength, setSub_order, sub_order, openmotherorder, setMotherOrder, setOrder_List, trackingId, setTrackingId, order_list, setUniqOrderId, uniqOrderId, setTrackingNumbers, setBabyorderlists, setRemainsproducts, deselectitem, setDeselectitem, babyorderlists, trackingNumbers, selectedItems, remainsproducts, setSelectedItems, setBabyOrderData, babyorderdata, babyordernumber, setBabyOrderNumber }}>
            {props.children}
        </ModalContext.Provider>
    );
};


