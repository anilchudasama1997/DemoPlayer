import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon1 from 'react-native-vector-icons/Entypo';
import Slider from '@react-native-community/slider';
import SkeletonItem from '../Components/SkeletonItem';
import {SafeAreaView} from 'react-native-safe-area-context';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import ShapeIcon from '../assets/playIcon/shape';

const {width} = Dimensions.get('window');
const SIZE = width * 0.7;
const CENTER = SIZE / 1.96;
const RADIUS = SIZE * 0.32;

const playlists = [
  {
    id: 0,
    emoji: '😎',
    label: 'Playlist 1',
    angle: 35,
    bgAngle: 0,
    bg: ['#7759D2', '#FAAC17'],
    listBg: ['#D4944D', 'black'],
    gif: require('../assets/gif/playlist1.gif'),
  },
  {
    id: 1,
    emoji: '🍹',
    label: 'Playlist 2',
    angle: 120,
    bgAngle: 90,
    bg: ['#7759D2', '#AD4500'],
    listBg: ['#9E4D3E', 'black'],
    gif: require('../assets/gif/playlist2.gif'),
  },
  {
    id: 2,
    emoji: '🎉',
    label: 'Playlist 3',
    angle: 265,
    bgAngle: 230,
    bg: ['#7759D2', '#818181'],
    listBg: ['#7F7990', 'black'],
    gif: require('../assets/gif/playlist3.gif'),
  },
];

const PlaylistSelector = ({navigation, route}) => {
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const songs = [
    {id: '1', title: 'Blinding Lights', artist: 'The Weeknd', time: '3:20'},
    {id: '2', title: 'Watermelon Sugar', artist: 'Harry Styles', time: '2:54'},
    {id: '3', title: 'Levitating', artist: 'Dua Lipa', time: '3:23'},
    {id: '4', title: 'Peaches', artist: 'Justin Bieber', time: '3:18'},
    {id: '5', title: 'Save Your Tears', artist: 'The Weeknd', time: '3:35'},
    {id: '6', title: 'Blinding Lights', artist: 'The Weeknd', time: '3:20'},
    {id: '7', title: 'Watermelon Sugar', artist: 'Harry Styles', time: '2:54'},
    {id: '8', title: 'Levitating', artist: 'Dua Lipa', time: '3:23'},
    {id: '9', title: 'Peaches', artist: 'Justin Bieber', time: '3:18'},
    {id: '10', title: 'Save Your Tears', artist: 'The Weeknd', time: '3:35'},
  ];

  const DATA = [
    {
      id: '1',
      title: 'Header',
      subtitle: 'Sub Header',
      cta: 'CTA',
    },
    {
      id: '2',
      title: 'Header',
      subtitle: 'Sub Header',
      cta: 'CTA',
    },
    {
      id: '3',
      title: 'Header',
      subtitle: 'Sub Header',
      cta: 'CTA',
    },
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  //Circle rotation
  const rotation = useSharedValue(0);
  const rotateToIndex = index => {
    const angle = (index - selected) * 120;
    rotation.value = withTiming(rotation.value + angle, {duration: 500});

    bgRotation.value = withTiming(
      getAngle([0, 90, 230], selected, index, bgRotation.value),
      {duration: 500},
    );
    setSelected(index);
  };

  const getAngle = (angles, currentIndex, newIndex, currentRotation) => {
    const currentAngle = angles[currentIndex];
    const targetAngle = angles[newIndex];

    let diff = targetAngle - currentAngle;
    if (diff < 0) {
      diff += 360;
    }
    let angle = currentRotation + diff;

    return angle;
  };

  useEffect(() => {
    opacity.value = withTiming(1, {duration: 500});
    scale.value = withSequence(
      withTiming(1.1, {duration: 300}),
      withSpring(1, {damping: 5, stiffness: 150}),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const renderPlaylistIcon = (item, index) => {
    const angleDeg = item.angle;
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = RADIUS * Math.cos(angleRad);
    const y = RADIUS * Math.sin(angleRad);
    const isSelected = index === selected;

    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => rotateToIndex(index)}
        style={[
          styles.playlistButton,
          {
            left: CENTER + x - 20,
            top: CENTER + y - 20,
            zIndex: isSelected ? 10 : 1,
          },
        ]}>
        {isSelected ? (
          <Animated.View style={[styles.circleView, animatedStyle]}>
            <Image source={item.gif} style={{width: 60, height: 60}} />
          </Animated.View>
        ) : (
          <>
            <Text style={[styles.emoji]}>{item.emoji}</Text>
            <Text style={styles.label}>{item.label}</Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  // Shared value for rotation in degrees
  const bgRotation = useSharedValue(0);
  const bgAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${bgRotation.value}deg`}],
    };
  });

  const renderItem = ({item, index}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.index}>{index + 1}</Text>

      <View style={styles.songInfo}>
        <Text style={styles.songTitle}>{item.title}</Text>
        <Text style={styles.songArtist}>{item.artist}</Text>
      </View>

      <Text style={styles.songTime}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView style={styles.paddingContainer}>
        <View style={styles.container}>
          <Animated.View style={[bgAnimatedStyle]}>
            <ShapeIcon
              height={400}
              width={400}
              color1={playlists[selected].bg[0]}
              color2={playlists[selected].bg[1]}
            />
          </Animated.View>

          <View style={[styles.playlistWrapper, {position: 'absolute'}]}>
            {playlists.map(renderPlaylistIcon)}
            <TouchableOpacity style={styles.playButton}>
              <Text style={{fontSize: 35, color: '#fff'}}>▶</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View>
          <Text style={styles.playListTitle}>{playlists[selected].label}</Text>
          <View style={styles.trackContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => console.log('Left')}>
              <Icon name="play-skip-back" size={23} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={togglePlayPause}>
              {isPlaying ? (
                <Icon1 name={'controller-paus'} size={35} color="#000" />
              ) : (
                <Icon1 name={'controller-play'} size={45} color="#000" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => console.log('Right')}>
              <Icon name="play-skip-forward" size={23} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.sliderContainer}>
            <Slider
              style={{flex: 1}}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor="#C3DDFF"
              maximumTrackTintColor="#C3DDFF"
              thumbTintColor="#fff"
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.time}>2:00</Text>
              <Text style={styles.time}>4:00</Text>
            </View>
          </View>
        </View>
        <Text style={styles.playlistTitle}>Playlist created by FIVE</Text>
        <LinearGradient
          colors={[playlists[selected].listBg[0], 'black']}
          style={styles.container1}>
          <FlatList
            data={songs}
            scrollEnabled={false}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{paddingVertical: 20}}
          />
        </LinearGradient>
        <View style={styles.container3}>
          <Text style={styles.title}>ALSO ON</Text>

          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.icon1}>
              <Image
                source={require('../assets/playIcon/youtube.png')}
                style={styles.icon1}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon1}>
              <Image
                source={require('../assets/playIcon/spotee.png')}
                style={styles.icon1}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon1}>
              <Image
                source={require('../assets/playIcon/insta.png')}
                style={styles.icon1}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon1}>
              <Image
                source={require('../assets/playIcon/apple.png')}
                style={styles.icon1}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon1}>
              <Image
                source={require('../assets/playIcon/vio.png')}
                style={styles.icon1}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon1}>
              <Image
                source={require('../assets/playIcon/fi.png')}
                style={styles.icon1}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.container3}>
          <Text style={styles.title}>Title 1</Text>
          <FlatList
            style={{marginTop: 15}}
            data={loading ? Array(4).fill({}) : DATA}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={({item}) => (
              <SkeletonItem item={item} loading={loading} />
            )}
          />
        </View>
        <View style={styles.container3}>
          <Text style={styles.title}>Title 2</Text>
          <FlatList
            style={{marginTop: 15}}
            data={loading ? Array(4).fill({}) : DATA}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={({item}) => <SkeletonItem item={item} loading={true} />}
          />

          <SkeletonPlaceholder
            backgroundColor="#1D1D1D"
            highlightColor="#444"
            borderRadius={10}
            speed={1000}>
            <View style={{width: '100%', height: 100, marginTop: 20}} />
          </SkeletonPlaceholder>
        </View>
        <View style={styles.container3}>
          <Text style={styles.title}>Title 3</Text>
          <FlatList
            style={{marginTop: 15}}
            data={loading ? Array(4).fill({}) : DATA}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={({item}) => <SkeletonItem item={item} loading={true} />}
          />
        </View>
        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: '#1D1D1D'},
  paddingContainer: {
    flex: 1,
    backgroundColor: '#1D1D1D',
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistWrapper: {
    width: 350,
    height: 350,
    borderRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'relative',
  },
  rotatingHighlight: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightCircle: {
    position: 'absolute',
    top: SIZE * 0.02,
    left: SIZE * 0.26,
    width: 70,
    height: 70,
    borderRadius: '50%',
    backgroundColor: 'black',
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleView: {
    width: 70,
    height: 70,
    borderRadius: '50%',
    backgroundColor: 'black',
    shadowColor: '#fff',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.6,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 45,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  playlistButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
    width: 90,
  },
  emoji: {
    fontSize: 35,
  },
  label: {
    fontFamily: 'TT Norms',
    fontWeight: '400',
    color: '#fff',
    fontSize: 10,
    marginTop: 2,
  },

  playlistTitle: {
    fontFamily: 'TT Norms',
    fontWeight: '400',
    color: '#ECE9E752',
    fontSize: 12,
    marginVertical: 20,
    alignSelf: 'center',
  },
  container1: {
    height: 400,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  index: {
    fontFamily: 'Montserrat',
    width: 20,
    fontSize: 14,
    color: '#ADACB1',
    fontWeight: '400',
  },
  songInfo: {
    flex: 1,
    paddingLeft: 5,
  },
  songTitle: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#fff',
    fontWeight: '400',
  },
  songArtist: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#aaa',
    marginTop: 2,
  },
  songTime: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#aaa',
    fontWeight: '400',
  },

  container3: {
    marginTop: 20,
  },
  title: {
    fontFamily: 'Nimbus Sans D OT',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#fff',
  },
  playListTitle: {
    fontFamily: 'Nimbus Sans D OT',
    fontWeight: '700',
    fontSize: 20,
    letterSpacing: 3,
    textTransform: 'uppercase',
    color: '#C3DDFF',
    textAlign: 'center',
    marginVertical: 20,
    shadowColor: '#745AD2',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  icon1: {
    height: 40,
    aspectRatio: 1,
    marginHorizontal: 8,
    resizeMode: 'contain',
  },
  trackContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  iconButton: {
    height: 44,
    aspectRatio: 1,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseButton: {
    height: 70,
    aspectRatio: 1,
    marginHorizontal: 30,
    borderRadius: '50%',
    backgroundColor: '#C3DDFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C3DDFF',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },

  sliderContainer: {
    marginTop: 20,
    width: '100%',
  },
  time: {
    color: '#FFFFFF',
    fontSize: 12,
    width: 30,
    textAlign: 'center',
    fontFamily: 'TT Norms',
    fontWeight: '400',
  },
});

export default PlaylistSelector;
