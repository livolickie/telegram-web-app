import {Button, Card, Col, Row, Image, Modal} from "antd";
import React, {useCallback, useEffect, useState} from "react";

const styles: Record<string, React.CSSProperties> = {
    gridStyle: {
        width: '50%',
        textAlign: 'center',
    },
    button: {
        width: '70%',
        height: '10vh',
        marginTop: 'auto 10%'
    },
    footer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        marginTop: '5%'
    }
}

const products = [
    {
        id: 1,
        title: 'iPhone 11, белый 64GB',
        price: 40000,
        imageUrl: 'https://spb-apple.ru/image/cache/catalog/iphone%2011/White%201-700x700.jpg'
    },
    {
        id: 2,
        title: 'iPhone 12, фиолетовый 64GB',
        price: 50000,
        imageUrl: 'https://istudio-ufa.ru/a/istudio/files/multifile/2353/100032805910b0_1.webp'
    },
    {
        id: 3,
        title: 'iPhone 13 Pro Max, зеленый 128GB',
        price: 100000,
        imageUrl: 'https://spb-apple.ru/image/cache/catalog/Add/13%20pro%20max/a75487514ab2bd7b9018089b9c6016ef-700x700.jpg'
    },
    {
        id: 4,
        title: 'iPhone 14, желтый 128GB',
        price: 125000,
        imageUrl: 'https://store-apple.msk.ru/image/cache/catalog/tovary/iphone/iphone-14-plus/apple-iphone-14-14-plus-joltyy-800x800.jpg'
    }
]

const tg = (window as any).Telegram.WebApp;

interface SelectedItem {
    itemId: number,
    count: number
}

export function MainApp() {
    
    const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([])

    const onSendData = useCallback(() => {
        const data = {
            selectedItems
        }
        tg.sendData(JSON.stringify(data));
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
    
    const onApplyOrder = () => {
        const totalPrice = selectedItems.reduce((prev, item) => prev + item.count * (products.find(x => x.id == item.itemId)?.price)!, 0)
        Modal.confirm({
            title: 'Вы уверены, что хотите подвердить заказ?',
            content: `Сумма вашего заказа составляет ${totalPrice} руб.`,
            onOk: () => {
                tg?.sendData(JSON.stringify(selectedItems));
                setSelectedItems([])
                // Telegram send data
            }
        })
    }
    
    return <div><Card title="iPhone's Market">
        {
            products.map(x => (
                <Card.Grid key={x.id} style={styles.gridStyle} hoverable={false}>
                    <Row gutter={[10,10]}>
                        <Col span={24}>
                            <Image src={x.imageUrl}/>
                        </Col>
                        <Col span={24}>{x.title}</Col> 
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
        {/*<div style={styles.footer}>*/}
        {/*    <Button type={"primary"} size={'large'} style={styles.button} onClick={onApplyOrder}>*/}
        {/*        Подтвердить заказ*/}
        {/*    </Button>*/}
        {/*</div>*/}
    </div>
}