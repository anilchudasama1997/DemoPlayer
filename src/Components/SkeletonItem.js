import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const SkeletonItem = ({ item, loading }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let interval;

    if (!loading) {
      interval = setInterval(() => {
        videoRef.current?.seek(0); // replay from start
      }, 5000); // repeat every 5s
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  return (
    <View style={styles.shadowWrapper}>
      <View style={styles.item}>
        {!loading && (
          <Video
            ref={videoRef}
            source={require('../assets/playIcon/video.mp4')}
            style={styles.video}
            muted
            resizeMode="cover"
            repeat={false} // no auto-repeat
            rate={1.0}
            ignoreSilentSwitch="obey"
            paused={false} // always playing
          />
        )}

        {loading ? (
          <SkeletonPlaceholder
            backgroundColor="#1D1D1D"
            highlightColor="#444"
            borderRadius={10}
            speed={400}
          >
            <View style={{ width: '100%', height: '100%' }} />
          </SkeletonPlaceholder>
        ) : (
          <LinearGradient
            colors={['transparent', 'transparent', 'transparent', 'black']}
            style={styles.gradientOverlay}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end', padding: 10 }}>
              <Text style={styles.title1}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.cta}>{item.cta}</Text>
                <Ionicons name="chevron-forward" size={20} color="#888" style={{ marginTop: 8 }} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowWrapper: {
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#1D1D1D',
    marginRight: 15,
    shadowColor: 'white',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 8,
  },
  item: {
    width: 180,
    backgroundColor: '#1D1D1D',
    borderRadius: 10,
    height: 200,
    overflow: 'hidden',
  },
  video: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  gradientOverlay: {
    flex: 1,
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  title1: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 13,
    color: '#ccc',
    marginTop: 4,
  },
  cta: {
    fontSize: 14,
    color: '#42a5f5',
    marginTop: 8,
  },
});

export default SkeletonItem;
