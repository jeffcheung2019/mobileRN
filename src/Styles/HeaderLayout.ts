import { Spacing } from "@/Theme/Variables"
import { TextStyle } from "react-native"

const HEADER: TextStyle = {
    paddingBottom: Spacing[5] - 1,
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
}
const HEADER_TITLE: TextStyle = {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1.5,
    lineHeight: 15,
    textAlign: "center",
}


export default {
    HEADER,
    HEADER_TITLE,
  }