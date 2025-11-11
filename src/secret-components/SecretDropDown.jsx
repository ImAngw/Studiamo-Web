import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import { useTranslation } from 'react-i18next';


function SecretDropDown({options, defaultValue, setDefaultValue}) {
    const { t } = useTranslation();
    const monthStrings = t("Months", { returnObjects: true });

    const monthMap = {
        1: monthStrings.january,
        2: monthStrings.february,
        3: monthStrings.march,
        4: monthStrings.april,
        5: monthStrings.may,
        6: monthStrings.june,
        7: monthStrings.july,
        8: monthStrings.august,
        9: monthStrings.september,
        10: monthStrings.october,
        11: monthStrings.november,
        12: monthStrings.december
    }


    return (
        <div>
            <Dropdown>
                <Dropdown.Toggle
                    style={{
                        backgroundColor: 'transparent',  // nessun colore di sfondo
                        border: '1px solid black',     // bordo verde (o quello che vuoi)
                        color: 'black',                // testo verde per coerenza
                        boxShadow: 'none'                // rimuove l’ombra del focus
                    }}
                >
                    {monthMap[defaultValue] !== undefined ? monthMap[defaultValue] : defaultValue}
                </Dropdown.Toggle>

                <Dropdown.Menu
                    style={{
                        minWidth: '100px',   // larghezza minima
                        maxHeight: '200px',  // altezza massima
                        overflowY: 'auto',   // scroll se troppi elementi
                    }}
                >
                    {options && options.map((option, index) => (
                        index === options.length - 1 ? (

                            <Dropdown.Item
                                key={index}
                                onClick={() => {
                                    setDefaultValue(option)
                                }}
                            >
                                {monthMap[option] !== undefined ? monthMap[option] : option}
                            </Dropdown.Item>

                            ) : (
                            <div key={index}>
                                <Dropdown.Item

                                    onClick={() => {
                                        setDefaultValue(option)
                                    }}
                                >
                                    {monthMap[option] !== undefined ? monthMap[option] : option}
                                </Dropdown.Item>
                                <Dropdown.Divider />
                            </div>
                        )
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export default SecretDropDown;