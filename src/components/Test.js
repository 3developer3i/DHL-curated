import { Text, Icon } from '@shopify/polaris';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    ChevronDownMinor, ChevronUpMinor
} from '@shopify/polaris-icons';

const MotherorderIndexTable = () => {

    const [motherorder, setMotherOrder] = useState([]);

    const [expandableData, setExpandableData] = useState([]);

    const fetchAllBabyOrderlist = () => {
        axios
            .get("http://3itesth18.pagekite.me/all_mother_order?shop_name=user-action.myshopify.com")
            .then((res) => {
                // console.log(res);
                setMotherOrder(res.data.mother_order_list);
            })
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        fetchAllBabyOrderlist();
    }, []);

    const [collapsibleStates, setCollapsibleStates] = useState(
        motherorder.map(() => false)
    );

    const toggleCollapsible = (index) => {
        const newCollapsibleStates = [...collapsibleStates];
        newCollapsibleStates[index] = !newCollapsibleStates[index];
        setCollapsibleStates(newCollapsibleStates);
    };
    return (
        <div className="Polaris-LegacyCard">
            <div className="Polaris-IndexTable">
                <div className="Polaris-IndexTable__IndexTableWrapper Polaris-IndexTable__IndexTableWrapper--scrollBarHidden">
                    <div className="Polaris-IndexTable-ScrollContainer">
                        <table className="Polaris-IndexTable__Table Polaris-IndexTable__Table--sticky">
                            <thead>
                                <tr>
                                    <th className="Polaris-IndexTable__TableHeading Polaris-IndexTable__TableHeading--first" data-index-table-heading="true">
                                        {/ Add header content /}
                                    </th>
                                    <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Order Number</th>
                                    <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Babies Details</th>
                                    <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Date</th>
                                    <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {motherorder && motherorder.map((datas, index) => {
                                    return (
                                        <>
                                            <tr id={index} onClick={() => toggleCollapsible(index)} className="Polaris-IndexTable__TableRow">
                                                <td className="Polaris-IndexTable__TableCell Polaris-IndexTable__TableHeading--first">
                                                    {/ Add row content /}
                                                </td>
                                                <td style={{ padding: "0px " }} className="Polaris-IndexTable__TableCell">{datas.mother_order_id}</td>
                                                <td className="Polaris-IndexTable__TableCell">{datas.mother_order_number}</td>
                                                <td className="Polaris-IndexTable__TableCell">{datas.mother_order_date}</td>
                                                <td className="Polaris-IndexTable__TableCell">0$</td>

                                                <td className="Polaris-IndexTable__TableCell">
                                                    {collapsibleStates[index] ? <Icon
                                                        source={ChevronUpMinor}
                                                        tone="base"
                                                    /> : <Icon
                                                        source={ChevronDownMinor}
                                                        tone="base"
                                                    />}
                                                </td>
                                            </tr>
                                            {collapsibleStates[index] && <tr onClick={() => toggleCollapsible(index)}
                                                className={`Polaris-IndexTable__TableRow ${collapsibleStates[index] ? 'collapsible-open' : ''
                                                    }`} style={{ height: "90px" }}>
                                                <div class="Polaris-LegacyCard" style={{ display: "contents" }}>
                                                    <table style={{ position: "absolute", marginLeft: "50px" }} className="Polaris-IndexTable__Table Polaris-IndexTable__Table--sticky">
                                                        <thead>
                                                            <tr>
                                                                <th className="Polaris-IndexTable__TableHeading Polaris-IndexTable__TableHeading--first" data-index-table-heading="true">
                                                                    {/ Add header content /}
                                                                </th>
                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Order Number</th>
                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Title</th>
                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Total</th>
                                                                <th className="Polaris-IndexTable__TableHeading" data-index-table-heading="true">Date</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {datas.baby_order_data.map((data1, indexs) =>
                                                                <tr id={indexs} className="Polaris-IndexTable__TableRow">
                                                                    <td className="Polaris-IndexTable__TableCell Polaris-IndexTable__TableCell--first">
                                                                        {/ Add row content /}
                                                                    </td>
                                                                    <td className="Polaris-IndexTable__TableCell">#{data1.baby_order_number}</td>
                                                                    <td className="Polaris-IndexTable__TableCell">{data1.baby_title}</td>
                                                                    <td className="Polaris-IndexTable__TableCell">{data1.baby_total}</td>
                                                                    <td className="Polaris-IndexTable__TableCell">{data1.baby_date}</td>
                                                                    <td className="Polaris-IndexTable__TableCell">
                                                                        {/ Add badge content /}
                                                                    </td>
                                                                    <td className="Polaris-IndexTable__TableCell">
                                                                        {/ Add badge content /}
                                                                    </td>
                                                                </tr>)}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </tr>}
                                        </>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MotherorderIndexTable;