import {Button, Card, Col, Row, Image} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import {useTelegram} from "../hooks/useTelegram";

const styles: Record<string, React.CSSProperties> = {
    gridStyle: {
        width: '50%',
        textAlign: 'center',
    }
}

interface Product {
    id: string,
    name: string,
    imageUrl: string,
    price: number
}

// const products = [
//     {
//         id: 1,
//         name: 'iPhone 11, белый 64GB',
//         price: 40000,
//         imageUrl: 'https://spb-apple.ru/image/cache/catalog/iphone%2011/White%201-700x700.jpg'
//     },
//     {
//         id: 2,
//         name: 'iPhone 12, фиолетовый 64GB',
//         price: 50000,
//         imageUrl: 'https://istudio-ufa.ru/a/istudio/files/multifile/2353/100032805910b0_1.webp'
//     },
//     {
//         id: 3,
//         name: 'iPhone 13 Pro Max, зеленый 128GB',
//         price: 100000,
//         imageUrl: 'https://spb-apple.ru/image/cache/catalog/Add/13%20pro%20max/a75487514ab2bd7b9018089b9c6016ef-700x700.jpg'
//     },
//     {
//         id: 4,
//         name: 'iPhone 14, желтый 128GB',
//         price: 125000,
//         imageUrl: 'https://store-apple.msk.ru/image/cache/catalog/tovary/iphone/iphone-14-plus/apple-iphone-14-14-plus-joltyy-800x800.jpg'
//     }
// ]

interface SelectedItem {
    itemId: string,
    count: number
}

export function MainApp() {
    
    const [products, setProducts] = useState<Product[]>([])
    
    const {tg} = useTelegram()

    useEffect(() => {
        tg.ready();
        
        const urlParams = new URLSearchParams(window.location.search);

        setProducts(JSON.parse(urlParams.get('products') ?? "[]") as Product[])
    }, []);
    
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])

    const onSendData = useCallback(() => {
        const data = {
            selectedItems
        }
        tg.sendData(JSON.stringify(data));
        setSelectedItems([])
    }, [selectedItems])
    
    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Отправить данные'
        })
    }, [])

    useEffect(() => {
        if(!selectedItems.length) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [selectedItems])
    
    return <div><Card title="iPhone's Market">
        {
            products.map(x => (
                <Card.Grid key={x.id} style={styles.gridStyle} hoverable={false}>
                    <Row gutter={[10,10]}>
                        <Col span={24}>
                            <Image src={x.imageUrl}/>
                        </Col>
                        <Col span={24}>{x.name}</Col> 
                        <Col span={24}>{x.price} руб.</Col> 
                        <Col span={24}>
                            <Button type={"primary"} onClick={() => {
                                const item = selectedItems.find(i => i.itemId == x.id)
                                if (!item) {
                                    setSelectedItems([
                                        ...selectedItems, {
                                        itemId: x.id,
                                            count: 1
                                        }
                                    ])
                                } else {
                                    setSelectedItems([
                                        ...selectedItems.filter(i => i.itemId != x.id),
                                        {
                                            itemId: x.id,
                                            count: item.count + 1
                                        }
                                    ])
                                }
                            }}>Добавить</Button>
                        </Col> 
                        <Col span={24}>
                            {
                                selectedItems.some(i => i.itemId == x.id) ? `Выбрано ${
                                    selectedItems.find(i => i.itemId == x.id)?.count 
                                } шт.`  : ''
                            }
                        </Col>
                    </Row>
                </Card.Grid>
            ))
        }
    </Card>
    </div>
}