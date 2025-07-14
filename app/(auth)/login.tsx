import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import {
  BACKGROUND,
  CARD_BACKGROUND,
  PRIMARY,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
} from "../constants/colors";
import { useToast } from "../hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // const { login } = useTourLMS(); // Disabled
  const { toast } = useToast();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Disabled login logic
      // const userData = { email, password };
      // await login(userData);
      toast({
        title: "Welcome Back!",
        description:
          "You've entered African Intelligence. Continue your ascent!",
      });
      router.replace("/screens/(tabs)/student");
    } catch (error) {
      console.error("Login error:", error);
      const message =
        error && typeof error === "object" && "message" in error
          ? (error as { message?: string }).message
          : "The tribe couldn't verify your path. Try again.";
      toast({
        title: "Entry Denied",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: BACKGROUND }]}>
      <View style={styles.content}>
        <View style={styles.formContainer}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/logo1.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.title, { color: TEXT_PRIMARY }]}>
              Enter African Intelligence
            </Text>
            <Text style={[styles.subtitle, { color: TEXT_SECONDARY }]}>
              Continue your path in the tribe&apos;s ascent
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              theme={{ colors: { primary: PRIMARY } }}
              disabled={isLoading}
              placeholder="you@africanintelligence.com"
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
              theme={{ colors: { primary: PRIMARY } }}
              disabled={isLoading}
              placeholder="••••••••"
            />

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isLoading}
              disabled={isLoading}
              style={styles.loginButton}
              theme={{ colors: { primary: PRIMARY } }}
            >
              {isLoading ? "Entering..." : "Enter the Tribe"}
            </Button>

            {/* <Button
              mode="outlined"
              disabled={isLoading}
              style={styles.googleButton}
              icon="google"
            >
              Continue with Google
            </Button> */}

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: TEXT_SECONDARY }]}>
                Not yet in the tribe?{" "}
                <Text
                  style={styles.registerLink}
                  onPress={() => router.push("/(auth)/register")}
                >
                  Join Now
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(234, 179, 8, 0.2)",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logoContainer: {
    backgroundColor: "rgba(234, 179, 8, 0.2)",
    padding: 15,
    borderRadius: 30,
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    borderColor: "rgba(234, 179, 8, 0.2)",
  },
  loginButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  googleButton: {
    marginTop: 8,
    borderColor: PRIMARY,
  },
  registerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    fontSize: 16,
  },
  registerLink: {
    color: PRIMARY,
    fontWeight: "bold",
  },
});
