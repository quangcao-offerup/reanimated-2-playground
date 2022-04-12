import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {
  NativeViewGestureHandler,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import {FlatList} from 'react-native-gesture-handler';

export default function AnimatedStyleUpdateExample(props) {
  const panGestureHandlerRef = React.useRef(null);
  const nativeViewGestureHandlerRef = React.useRef(null);

  const tracker = useSharedValue({x: 0, y: 0});

  const gestureEventHandler = useAnimatedGestureHandler(
    {
      onStart: (e) => {
        tracker.value = {
          x: e.absoluteX,
          y: e.absoluteY,
        };
        console.log('Onstart', e.translationX, e.translationY);
      },
      onActive: (e) => {
        tracker.value = {
          x: e.absoluteX,
          y: e.absoluteY,
        };

        console.log('onActive', e.translationX, e.translationY);
      },
      onCancel: () => {
        console.log('onCancel');
      },
      onEnd: (e) => {
        tracker.value = {
          x: 0,
          y: 0,
        };
        console.log('onEndTranslation', e.translationX, e.translationY);
      },
      onFail: (e) => {
        console.log('onFail', e);
      },
    },
    [],
  );

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: tracker.value.x,
        },
        {
          translateY: tracker.value.y,
        },
      ],
    }),
    [],
  );
  const trackerSize = 30;

  const DATA = [...Array(20)].map((u, i) => ({
    id: i,
    title: i,
  }));

  const Item = ({title}) => (
    <View style={styles.item}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
  const renderItem = ({item}) => <Item key={item.id} title={item.title} />;

  /*
   *"react-native-gesture-handler": "1.10.3",
   *"react-native-reanimated": "2.3.1",
   */
  return (
    <SafeAreaView style={styles.container}>
      <PanGestureHandler
        ref={panGestureHandlerRef}
        simultaneousHandlers={nativeViewGestureHandlerRef}
        onGestureEvent={gestureEventHandler}
        avgTouches
        minPointers={1}
        maxPointers={1}
        // failOffsetX={[-5, 5]}
        // activeOffsetX={[-10, 10]}
        // activeOffsetY={[-10, 10]}
        enabled>
        <Animated.View style={{flex: 1}} collapsable={false}>
          <NativeViewGestureHandler
            ref={nativeViewGestureHandlerRef}
            enabled
            simultaneousHandlers={panGestureHandlerRef}>
            <Animated.View style={{flex: 1}} collapsable={false}>
              <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                bounces={false}
                // scrollEnabled={false}
              />
              {/* <ScrollView
                bounces={false}
                //scrollEnabled={false}
              >
                {DATA.map((item) => renderItem({item}))}
                <View>
                  <Text style={styles.highlight}>App.js</Text>
                </View>
              </ScrollView> */}
            </Animated.View>
          </NativeViewGestureHandler>
        </Animated.View>
      </PanGestureHandler>

      <Animated.View
        style={[
          {
            width: trackerSize,
            height: trackerSize,
            borderRadius: trackerSize,
            position: 'absolute',
            backgroundColor: 'red',
            top: -trackerSize,
          },
          animatedStyle,
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
