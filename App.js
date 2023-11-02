import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import axios from "axios";
import Swipeable from "react-native-gesture-handler/Swipeable";

const timeFromNow = (date) => {
  const now = new Date();
  const createdAt = new Date(date);
  const diffInSeconds = Math.floor((now - createdAt) / 1000);
  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const relativeTimeFormat = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  if (minutes < 60) {
    return relativeTimeFormat.format(-minutes, "minute");
  } else if (hours < 24) {
    return relativeTimeFormat.format(-hours, "hour");
  } else {
    return relativeTimeFormat.format(-days, "day");
  }
};

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("https://hn.algolia.com/api/v1/search_by_date?query=mobile")
      .then((response) => setData(response.data.hits))
      .catch((error) => console.log(error));
  }, []);

  const handleDelete = (itemToDelete) => {
    setData((prevData) => prevData.filter((item) => item !== itemToDelete));
  };

  const renderRightActions = (progress, item) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    const opacity = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });
    return (
      <Animated.View style={[styles.deleteBox, { opacity }]}>
        <TouchableOpacity
          onPress={() => handleDelete(item)}
          style={styles.deleteBox}
        >
          <Animated.Text
            style={[styles.deleteText, { transform: [{ translateX: trans }] }]}
          >
            Delete
          </Animated.Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  console.log("data", data);
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => `${item.story_id}-${item.created_at}`}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={(progress) =>
              renderRightActions(progress, item)
            }
            friction={2}
            tension={40}
          >
            <View style={styles.listItem}>
              <Text style={styles.title}>
                {item._highlightResult.story_title.value}
              </Text>
              <Text style={styles.authorTime}>
                {item._highlightResult.author.value} -{" "}
                {timeFromNow(item.created_at)}
              </Text>
            </View>
          </Swipeable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingBottom: "100px",
  },
  listItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#CCCCCC",
    padding: 10,
  },
  title: {
    fontSize: 16,
    marginBottom: 5,
  },
  authorTime: {
    fontSize: 14,
    color: "#888888",
  },
  deleteBox: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Home;
