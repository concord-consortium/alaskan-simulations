import { TranslationDict } from "common";
import April from "./assets/yugtun-audio/April.mp3";
import ArrivalAtPointB from "./assets/yugtun-audio/ArrivalatPointB.mp3";
import ArrivalAtPointC from "./assets/yugtun-audio/ArrivalatPointC.mp3";
import AtoB from "./assets/yugtun-audio/AtoB.mp3";
import August from "./assets/yugtun-audio/August.mp3";
import BtoC from "./assets/yugtun-audio/BtoC.mp3";
import ChartHeadingsTime from "./assets/yugtun-audio/ChartHeadingsTime.mp3";
import Constellations from "./assets/yugtun-audio/Constellations.mp3";
import DateAndTime from "./assets/yugtun-audio/DateAndTime.mp3";
import December from "./assets/yugtun-audio/December.mp3";
import DepartureFromPointA from "./assets/yugtun-audio/DeparturefromPointA.mp3";
import DepartureFromPointB from "./assets/yugtun-audio/DeparturefromPointB.mp3";
import February from "./assets/yugtun-audio/February.mp3";
import Heading from "./assets/yugtun-audio/Heading.mp3";
import January from "./assets/yugtun-audio/January.mp3";
import July from "./assets/yugtun-audio/July.mp3";
import June from "./assets/yugtun-audio/June.mp3";
import March from "./assets/yugtun-audio/March.mp3";
import May from "./assets/yugtun-audio/May.mp3";
import Midnight from "./assets/yugtun-audio/Midnight.mp3";
import NavigationMarks from "./assets/yugtun-audio/NavigationMarks.mp3";
import Noon from "./assets/yugtun-audio/Noon.mp3";
import November from "./assets/yugtun-audio/November.mp3";
import October from "./assets/yugtun-audio/October.mp3";
import PlanYourRoute from "./assets/yugtun-audio/PlanYourRoute.mp3";
import RecordStarChartForPartADeparture from "./assets/yugtun-audio/RecordStarChartforPartADeparture.mp3";
import RecordStarChartForPartBArrival from "./assets/yugtun-audio/RecordStarChartforPartBArrival.mp3";
import RecordStarChartForPartBDeparture from "./assets/yugtun-audio/RecordStarChartforPartBDeparture.mp3";
import RecordStarChartForPartCArrival from "./assets/yugtun-audio/RecordStarChartforPartCArrival.mp3";
import ResetRoute from "./assets/yugtun-audio/ResetRoute.mp3";
import September from "./assets/yugtun-audio/September.mp3";
import TakeYourTrip from "./assets/yugtun-audio/TakeYourTrip.mp3";
import Western from "./assets/yugtun-audio/Western.mp3";
import Yupik from "./assets/yugtun-audio/Yupik.mp3";

export const translations: TranslationDict = {
  "CREDITS.HEADER": { string: "Credits" },
  "INSTRUCTIONS.HEADER": { string: "Star Navigation Experiments" },
  // Bottom container
  "MIDNIGHT": { string: "Midnight", mp3: new Audio(Midnight) },
  "NOON": { string: "Noon", mp3: new Audio(Noon) },
  "YUPIK": { string: "Yup'ik", mp3: new Audio(Yupik) },
  "WESTERN": { string: "Western", mp3: new Audio(Western) },
  "CONSTELLATIONS": { string: "Constellations", mp3: new Audio(Constellations) },
  "DATE_AND_TIME": { string: "Date and Time", mp3: new Audio(DateAndTime) },
  "NAVIGATION_MARKS": { string: "Navigation Marks", mp3: new Audio(NavigationMarks) },
  "MONTH.JANUARY_SHORT": { string: "Jan.", mp3: new Audio(January) },
  "MONTH.FEBRUARY_SHORT": { string: "Feb.", mp3: new Audio(February) },
  "MONTH.MARCH_SHORT": { string: "Mar.", mp3: new Audio(March) },
  "MONTH.APRIL_SHORT": { string: "Apr.", mp3: new Audio(April) },
  "MONTH.MAY_SHORT": { string: "May", mp3: new Audio(May) },
  "MONTH.JUNE_SHORT": { string: "Jun.", mp3: new Audio(June) },
  "MONTH.JULY_SHORT": { string: "Jul.", mp3: new Audio(July) },
  "MONTH.AUGUST_SHORT": { string: "Aug.", mp3: new Audio(August) },
  "MONTH.SEPTEMBER_SHORT": { string: "Sept.", mp3: new Audio(September) },
  "MONTH.OCTOBER_SHORT": { string: "Oct.", mp3: new Audio(October) },
  "MONTH.NOVEMBER_SHORT": { string: "Nov.", mp3: new Audio(November) },
  "MONTH.DECEMBER_SHORT": { string: "Dec.", mp3: new Audio(December) },
  "MONTH.JANUARY": { string: "January", mp3: new Audio(January) },
  "MONTH.FEBRUARY": { string: "February", mp3: new Audio(February) },
  "MONTH.MARCH": { string: "March", mp3: new Audio(March) },
  "MONTH.APRIL": { string: "April", mp3: new Audio(April) },
  "MONTH.MAY": { string: "May", mp3: new Audio(May) },
  "MONTH.JUNE": { string: "June", mp3: new Audio(June) },
  "MONTH.JULY": { string: "July", mp3: new Audio(July) },
  "MONTH.AUGUST": { string: "August", mp3: new Audio(August) },
  "MONTH.SEPTEMBER": { string: "September", mp3: new Audio(September) },
  "MONTH.OCTOBER": { string: "October", mp3: new Audio(October) },
  "MONTH.NOVEMBER": { string: "November", mp3: new Audio(November) },
  "MONTH.DECEMBER": { string: "December", mp3: new Audio(December) },
  "HEADING": { string: "Heading", mp3: new Audio(Heading) },
  // Right container
  "PLAN_YOUR_ROUTE": { string: "Plan Your Route", mp3: new Audio(PlanYourRoute) },
  "CHART_HEADINGS_TIMES": { string: "Chart Headings/Times", mp3: new Audio(ChartHeadingsTime) },
  "DEPARTURE_FROM_POINT_A": { string: "Departure from Point A", mp3: new Audio(DepartureFromPointA) },
  "DEPARTURE_FROM_POINT_B": { string: "Departure from Point B", mp3: new Audio(DepartureFromPointB) },
  "ARRIVAL_AT_POINT_B": { string: "Arrival at Point B", mp3: new Audio(ArrivalAtPointB) },
  "ARRIVAL_AT_POINT_C": { string: "Arrival at Point C", mp3: new Audio(ArrivalAtPointC) },
  "RECORD_STAR_CHART_FOR_POINT_A_DEPARTURE": { string: "Record Star Chart for Point A Departure", mp3: new Audio(RecordStarChartForPartADeparture) },
  "RECORD_STAR_CHART_FOR_POINT_B_ARRIVAL": { string: "Record Star Chart for Point B Arrival", mp3: new Audio(RecordStarChartForPartBArrival) },
  "RECORD_STAR_CHART_FOR_POINT_B_DEPARTURE": { string: "Record Star Chart for Point B Departure", mp3: new Audio(RecordStarChartForPartBDeparture) },
  "RECORD_STAR_CHART_FOR_POINT_C_ARRIVAL": { string: "Record Star Chart for Point C Arrival", mp3: new Audio(RecordStarChartForPartCArrival) },
  "A_TO_B": { string: "A→B", mp3: new Audio(AtoB) },
  "B_TO_C": { string: "B→C", mp3: new Audio(BtoC) },
  "TAKE_YOUR_TRIP": { string: "Take Your Trip", mp3: new Audio(TakeYourTrip) },
  "RESET_ROUTE": { string: "Reset Route", mp3: new Audio(ResetRoute) },
};
