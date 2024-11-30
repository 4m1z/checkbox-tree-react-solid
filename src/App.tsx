import React, { useEffect } from "react";
import "./App.css";

import ReactCheckboxTree from "react-checkbox-tree";



//////////// checkbox tree from the package

type Node = { 
    label: string, 
    value: string, 
    children?: Node[] 
}


type CheckboxTreeProps = { 
    nodes: Node[];
}

function CheckboxTree({ nodes }: CheckboxTreeProps) {
    const [checked, setChecked] = React.useState([
        '/app/Http/Controllers/WelcomeController.js',
        '/app/Http/routes.js',
        '/public/assets/style.css',
        '/public/index.html',
        '/.gitignore',
    ]);
    const [expanded, setExpanded] = React.useState(['/app']);

    return (
        <ReactCheckboxTree
            checked={checked}
            expanded={expanded}
            nodes={nodes}
            onCheck={(value) => { 
                setChecked(value);
            }}
            onExpand={(value) => { 
                setExpanded(value);
            }}
        />
    );
}


///////////////////// demo 

function onDebounce(fn: any, delay: number) {
    let timeout: any;
    return function (this: any, ...args: any) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}


function generateUUID()  {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    })

};

type Data = { 
    participant: string,
    event: string,
    publisherName: string,
    publisherUUID: string,
}

function reshapeData(data: Data[]): Node[] {
    const companyMap: Record<string, Node> = {};

    // Group by company (using publisherName) and then by event
    data.forEach(item => {
        const companyKey = item.publisherName;
        const eventKey = `${companyKey}-${item.event}`;

        // Ensure company node exists
        if (!companyMap[companyKey]) {
            companyMap[companyKey] = {
                label: item.publisherName,
                value: companyKey,
                children: [],
            };
        }

        const companyNode = companyMap[companyKey];

        // Find or create the event node
        let eventNode = companyNode.children?.find(node => node.value === eventKey);
        if (!eventNode) {
            eventNode = {
                label: item.event,
                value: eventKey,
                children: [],
            };
            companyNode.children?.push(eventNode);
        }

        // Add participant node
        eventNode.children?.push({
            label: item.participant,
            value: `${eventKey}-${item.participant}`,
            children: [],
        });
    });

    // Convert companyMap to an array of nodes
    return Object.values(companyMap);
}




function generateTreeData()  {
    // publishers 
    const pubs = Array.from({ length: 10 }, (_, i) => `Company${i + 1}`); 
    // networks 
    const nets = 50; 
    // channels
    const channs = 1000; 


    const data: Data[] = [];
    for(const company of pubs) {
        for (let i = 1; i <= nets; i++) {
            const eventName = `TechEvent${i}`;
            for (let p = 1; p <= channs; p++) {
                const participantName = `Par${p}`;
                data.push({
                    participant: participantName,
                    event: eventName,
                    publisherName: company,
                    publisherUUID: generateUUID(),
                });
            }
        }
    }

    return data;
};






function fetchFakeData() : Promise<Data[]> {
    // NOTE: this is intentional here 
    // in the real world senario i literally 
    // set this data after fetching from backend so 
    // i need to reshape during the fetching time :) 
    const treeData = generateTreeData();
    console.log("treeData", treeData); 
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(treeData);
        }, 1000);
    });
}


function App() {
    const [data, setData] = React.useState<Node[]>([]);
    const [loading, setLoading] = React.useState(false);

    function handleChange() {
        setLoading(true);
        onDebounce(async () => {
            const fetchedData = await fetchFakeData();
            setData(reshapeData(fetchedData));
            setLoading(false);
        }, 300)();
    }

    useEffect(() => { 
        console.log('data',data);
    });

    return (
        <div >
            <input onChange={handleChange} />

            {loading ?  ( 
                `loading....`
            ) : ( 
              <div style={{
                        display: 'flex', 
                        justifyContent: 'center', 
                        width:'20rem', 
                        height: '20rem', 
                        overflowY: 'scroll', 
              }}>
                <CheckboxTree nodes={data} />
              </div>
            )}
        </div>
    );
}

export default App;
