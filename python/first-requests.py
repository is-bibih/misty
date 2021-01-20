import requests
import json
import websockets
import asyncio
import websocket

IP = '192.168.1.112'
timeout = 10000

def print_image_list(ip, timeout=10000):
    url = 'http://' + ip + '/api/images/list'
    resp = requests.get(url, timeout=timeout)
    print(resp.json())

def set_led(ip, r=0, g=0, b=0, timeout=10000):
    url = 'http://' + ip + '/api/led'
    payload = {'red': r, 'green': g, 'blue': b}
    resp = requests.post(url, params=payload, timeout=timeout)
    print(resp.json())

async def print10tof(
    ip, name='tof', debounce=250, return_property=None,
    event_conditions= [{
        'Property': 'SensorId',
        'Inequality': '==',
        'Value': 'toffc'
    }]
):
    uri = 'ws://' + ip + '/pubsub'
    sub_msg = json.dumps({
        'Operation':        'subscribe',
        'Type':             'TimeOfFlight',
        'DebounceMs':       debounce,
        'EventName':        name,
        'ReturnProperty':   return_property,
        'EventConditions':  event_conditions,
    })
    unsub_msg = json.dumps({
        'Operation':        'unsubscribe',
        'EventName':        name,
    })
    async with websockets.connect(uri) as websocket:
        print('connected(?)')
        await websocket.send(sub_msg)
        print('sub message sent')
        for _ in range(10):
            resp = await websocket.recv()
            print('resp received')
            print(resp)
        await websocket.send(unsub_msg)
        print('unsub message sent')


async def print10tof_new(
    ip, name='tof', debounce=250, return_property=None,
    event_conditions= [{
        'Property': 'SensorId',
        'Inequality': '==',
        'Value': 'toffc'
    }]
):
    uri = 'ws://' + ip + '/pubsub'
    sub_msg = json.dumps({
        'Operation':        'subscribe',
        'Type':             'TimeOfFlight',
        'DebounceMs':       debounce,
        'EventName':        name,
        'ReturnProperty':   return_property,
        'EventConditions':  event_conditions,
    })
    unsub_msg = json.dumps({
        'Operation':        'unsubscribe',
        'EventName':        name,
    })
    websocket = await websockets.connect(uri)
    print('connected(?)')
    await websocket.send(sub_msg)
    print('sub message sent')
    for _ in range(10):
        resp = await websocket.recv()
        print('resp received')
        print(resp)
    await websocket.send(unsub_msg)
    print('unsub message sent')
    await websocket.close()

# callbacks
def on_message(_, msg): print(msg)
def on_error(_, error): print(error)
def on_close(_): print('websocket closed')

def on_open(ws, sub_msg, unsub_msg):
    ws.send(sub_msg)

def other_tof(
    ip, name='tof', debounce=250, return_property=None,
    event_conditions=[{
        'Property': 'SensorId',
        'Inequality': '==',
        'Value': 'toffc'
    }]
):
    uri = 'ws://' + ip + '/pubsub'
    sub_msg = json.dumps({
        'Operation':        'subscribe',
        'Type':             'TimeOfFlight',
        'DebounceMs':       debounce,
        'EventName':        name,
        'ReturnProperty':   return_property,
        'EventConditions':  event_conditions,
    })
    print(sub_msg)
    unsub_msg = json.dumps({
        'Operation':        'unsubscribe',
        'EventName':        name,
    })
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(uri,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = lambda websocket : on_open(websocket, sub_msg, unsub_msg)
    ws.run_forever()

#print_image_list(IP)
#set_led(IP)
asyncio.get_event_loop().run_until_complete(print10tof_new(IP))
#other_tof(IP)

