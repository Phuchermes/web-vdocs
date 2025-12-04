import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  FlatList,
  ScrollView,
  Image,
  Platform,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemedView from "../../components/ThemedView";
import ThemedText from "../../components/ThemedText";
import Spacer from "../../components/Spacer";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";

const API_URL = "http://backendvdocs.duckdns.org:3000";

export default function FileListScreen() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("irregular"); // default tab

  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  const typeMap = {
    irregular: "Biên Bản Bất Thường",
    avih: "Kiểm Soát AVIH/Security",
    uld: "Biên Bản Bất Thường ULD",
    kh: "Biên Bản Bất Thường Kho Hàng"
  };

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) return router.replace("/login");

        const userData = JSON.parse(await AsyncStorage.getItem("user")) || {};
        const userDept = userData.department;

        const res = await fetch(`${API_URL}/files`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) router.replace("/login");
          throw new Error("Lỗi server: " + res.status);
        }

        const data = await res.json();
        if (!Array.isArray(data)) {
          Alert.alert("Lỗi", "Dữ liệu từ server không hợp lệ");
          return;
        }

        // Lọc theo folder + phân quyền
        const filtered = data.filter((file) => {
          const folder = file.path.split("/")[1]; // irregular / avih
          return (
            folder === activeTab &&
            (file.department === userDept || file.targetDept === userDept)
          );
        });

        // Nhóm theo timestamp
        const grouped = {};
        filtered.forEach((file) => {
          const ts = file.timestamp || file.path.split("/")[2];
          if (!ts) return;

          const folder = file.path.split("/")[1];
          const type = typeMap[folder];

          if (!grouped[ts]) {
            grouped[ts] = {
              timestamp: ts,
              type,
              createdAt: file.createdAt,
              pdf: null,
              images: [],
              uploadedBy: file.uploadedBy,
              uploadedDept: file.department,
            };
          }

          if (file.mimetype === "application/pdf") grouped[ts].pdf = file;
          else grouped[ts].images.push(file);
        });

        const finalGroups = Object.values(grouped).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setGroups(finalGroups);
      } catch (err) {
        console.error("Fetch lỗi:", err);
        Alert.alert("Lỗi", err.message || "Không thể kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [router, activeTab]);

  const openFile = (file) => {
    if (!file?.path) return;
    const fileUrl = `${API_URL}/uploads${file.path}`;
    if (Platform.OS === "web") {
      window.open(fileUrl, "_blank");
    } else {
      Alert.alert("Xem file", "Chỉ mở xem trên web.");
    }
  };

  const renderRow = ({ item, index }) => (
    <ThemedView
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        borderBottomWidth: 1,
        borderBottomColor: theme.text + "33",
      }}
    >
      {/* STT */}
      <ThemedView
        style={{
          width: "5%",
          borderRightWidth: 1,
          borderRightColor: theme.text + "33",
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
        }}
      >
        <ThemedText>{index + 1}</ThemedText>
      </ThemedView>

      {/* Nội dung + người upload */}
      <ThemedView
        style={{
          width: "25%",
          borderRightWidth: 1,
          borderRightColor: theme.text + "33",
          justifyContent: "center",
          padding: 5,
        }}
      >
        <ThemedText>
          {item.type.toUpperCase()} — {item.timestamp}
        </ThemedText>
      </ThemedView>

      {/* Thời gian */}
      <ThemedView
        style={{
          width: "15%",
          borderRightWidth: 1,
          borderRightColor: theme.text + "33",
          justifyContent: "center",
          alignItems: "center",
          padding: 5,
        }}
      >
        <ThemedText>
          {item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "-"}
        </ThemedText>
      </ThemedView>

      {/* File PDF */}
      <ThemedView
        style={{
          width: "20%",
          borderRightWidth: 1,
          borderRightColor: theme.text + "33",
          justifyContent: "center",
          padding: 5,
        }}
      >
        {item.pdf ? (
          <TouchableOpacity onPress={() => openFile(item.pdf)}>
            <ThemedText style={{ textDecorationLine: "underline", color: theme.link }}>
              {item.pdf.filename}
            </ThemedText>
          </TouchableOpacity>
        ) : (
          <ThemedText>-</ThemedText>
        )}
      </ThemedView>

      {/* Hình ảnh */}
      <ThemedView style={{ width: "35%", padding: 5, flexDirection: "row", flexWrap: "wrap" }}>
        {item.images.map((img, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => openFile(img)}
            style={{ marginRight: 5, marginBottom: 5 }}
          >
            <Image
              source={{ uri: `${API_URL}/uploads${img.path}` }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: theme.text,
              }}
            />
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );

  return (
    <ThemedView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Tabs */}
      <ThemedView style={{ flexDirection: "row", justifyContent: "center", marginVertical: 10 }}>
        {["irregular", "avih", "uld", "kh"].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 20,
              marginHorizontal: 5,
              borderRadius: 20,
              backgroundColor: activeTab === tab ? theme.iconColor : theme.background,
            }}
          >
            <ThemedText style={{ color: activeTab === tab ? theme.background : theme.text, fontWeight: "bold" }}>
              {tab.toUpperCase()}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
        <ThemedText style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}>
          Danh Sách Form {typeMap[activeTab]}
        </ThemedText>
        <Spacer height={20} />
        <ThemedView style={{ flexDirection: "row", borderBottomWidth: 2, borderBottomColor: theme.text }}>
          <ThemedView style={{ width: "5%", borderRightWidth: 1, borderRightColor: theme.text, padding: 5, justifyContent: "center", alignItems: "center" }}>
            <ThemedText style={{ fontWeight: "bold" }}>STT</ThemedText>
          </ThemedView>
          <ThemedView style={{ width: "25%", borderRightWidth: 1, borderRightColor: theme.text, padding: 5, justifyContent: "center" }}>
            <ThemedText style={{ fontWeight: "bold" }}>Nội dung</ThemedText>
          </ThemedView>
          <ThemedView style={{ width: "15%", borderRightWidth: 1, borderRightColor: theme.text, padding: 5, justifyContent: "center", alignItems: "center" }}>
            <ThemedText style={{ fontWeight: "bold" }}>Thời gian</ThemedText>
          </ThemedView>
          <ThemedView style={{ width: "20%", borderRightWidth: 1, borderRightColor: theme.text, padding: 5, justifyContent: "center" }}>
            <ThemedText style={{ fontWeight: "bold" }}>File PDF</ThemedText>
          </ThemedView>
          <ThemedView style={{ width: "35%", padding: 5, justifyContent: "center" }}>
            <ThemedText style={{ fontWeight: "bold" }}>Hình ảnh</ThemedText>
          </ThemedView>
        </ThemedView>

        {loading ? (
          <ThemedView style={{ justifyContent: "center", alignItems: "center", marginTop: 30 }}>
            <ActivityIndicator size="large" />
            <ThemedText>Đang tải</ThemedText>
          </ThemedView>
        ) : groups.length > 0 ? (
          <FlatList
            data={groups}
            keyExtractor={(item) => item.timestamp.toString()}
            renderItem={renderRow}
          />
        ) : (
          <ThemedText style={{ textAlign: "center", marginTop: 30 }}>Chưa có form nào/Bộ phận liên quan mới xem nội dung này</ThemedText>
        )}
      </ScrollView>
    </ThemedView>
  );
}
