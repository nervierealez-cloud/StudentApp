
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

const API_URL = "http://localhost:5000";

export default function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("1st Year");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadStudents = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/students`);
      if (!response.ok) throw new Error("Could not load students.");

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      setMessage("Unable to load students. Check that your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const addStudent = async () => {
    if (!name.trim() || !course.trim()) {
      setMessage("Please enter the student name and course.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          course: course.trim(),
          yearLevel,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add student.");
      }

      setName("");
      setCourse("");
      setYearLevel("1st Year");
      setMessage("Student added successfully!");
      await loadStudents();
    } catch (error) {
      setMessage(error.message || "Unable to add student.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Student Management</Text>
      <Text style={styles.subtitle}>MongoDB + Express + Expo</Text>

      <View style={styles.card}>
        <Text style={styles.heading}>Add New Student</Text>

        <TextInput
          style={styles.input}
          placeholder="Student name"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Course (e.g. BSIT)"
          value={course}
          onChangeText={setCourse}
        />

        <Text style={styles.label}>Year Level</Text>
        <View style={styles.yearOptions}>
          {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((year) => (
            <TouchableOpacity
              key={year}
              style={[
                styles.yearButton,
                yearLevel === year && styles.selectedYear,
              ]}
              onPress={() => setYearLevel(year)}
            >
              <Text
                style={[
                  styles.yearText,
                  yearLevel === year && styles.selectedYearText,
                ]}
              >
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={addStudent}
          disabled={saving}
        >
          <Text style={styles.addButtonText}>
            {saving ? "Saving..." : "Add Student"}
          </Text>
        </TouchableOpacity>

        {!!message && <Text style={styles.message}>{message}</Text>}
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.heading}>Student Records</Text>
        <TouchableOpacity onPress={loadStudents}>
          <Text style={styles.refresh}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2563eb" />
      ) : students.length === 0 ? (
        <Text style={styles.empty}>No student records yet.</Text>
      ) : (
        students.map((student) => (
          <View key={student._id} style={styles.studentCard}>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentDetail}>
              Course: {student.course}
            </Text>
            <Text style={styles.studentDetail}>
              Year Level: {student.yearLevel}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginTop: 20,
  },
  subtitle: {
    color: "#64748b",
    marginTop: 6,
    marginBottom: 24,
  },
  card: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 14,
    marginBottom: 28,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 12,
    marginTop: 14,
    backgroundColor: "#ffffff",
  },
  label: {
    marginTop: 16,
    fontWeight: "600",
    color: "#334155",
  },
  yearOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  yearButton: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    padding: 10,
  },
  selectedYear: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  yearText: {
    color: "#334155",
    fontSize: 12,
  },
  selectedYearText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  message: {
    marginTop: 14,
    color: "#334155",
  },
  listHeader: {
    width: "100%",
    maxWidth: 600,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  refresh: {
    color: "#2563eb",
    fontWeight: "bold",
  },
  empty: {
    color: "#64748b",
    marginTop: 12,
  },
  studentCard: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 10,
    marginBottom: 12,
  },
  studentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 6,
  },
  studentDetail: {
    color: "#475569",
    marginTop: 4,
  },
});
