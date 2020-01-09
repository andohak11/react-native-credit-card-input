import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ViewPropTypes,
} from "react-native";

const s = StyleSheet.create({
  container: {
    paddingBottom: 26,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    fontStyle: "normal",
    letterSpacing: 0.22,
    color: '#949aab',
    paddingBottom: 6,
  },
  baseInputStyle: {
    fontSize: 16,
    fontStyle: "normal",
    letterSpacing: 0.03,
    color: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e3e8",
    paddingVertical: 9,
  },
});

export default class CCInput extends Component {
  static propTypes = {
    field: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    keyboardType: PropTypes.string,

    status: PropTypes.oneOf(["valid", "invalid", "incomplete"]),

    containerStyle: ViewPropTypes.style,
    inputStyle: Text.propTypes.style,
    labelStyle: Text.propTypes.style,
    validColor: PropTypes.string,
    invalidColor: PropTypes.string,
    placeholderColor: PropTypes.string,

    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onBecomeEmpty: PropTypes.func,
    onBecomeValid: PropTypes.func,
    additionalInputProps: PropTypes.shape(TextInput.propTypes),
  };

  static defaultProps = {
    label: "",
    value: "",
    status: "incomplete",
    containerStyle: {},
    inputStyle: {},
    labelStyle: {},
    onFocus: () => {},
    onChange: () => {},
    onBecomeEmpty: () => {},
    onBecomeValid: () => {},
    additionalInputProps: {},
  };

  componentWillReceiveProps = newProps => {
    const { status, value, onBecomeEmpty, onBecomeValid, field } = this.props;
    const { status: newStatus, value: newValue } = newProps;

    if (value !== "" && newValue === "") onBecomeEmpty(field);
    if (status !== "valid" && newStatus === "valid") onBecomeValid(field);
  };

  focus = () => this.refs.input.focus();

  _onFocus = () => this.props.onFocus(this.props.field);
  _onChange = value => this.props.onChange(this.props.field, value);

  render() {
    const { label, value, placeholder, status, keyboardType,
            containerStyle, inputStyle, labelStyle,
            additionalInputProps, focused } = this.props;
    let borderBottomColor = '#e0e3e8';
    if(status !== 'valid' && !focused && value) {
      borderBottomColor = '#F90604';
    }
    if(focused) {
      borderBottomColor = '#e0e3e8';
    }

    return (
      <TouchableOpacity onPress={this.focus}
        activeOpacity={0.99}>
        <View style={s.container}>
          <Text style={s.label}>{label}</Text>
          <TextInput ref="input"
            {...additionalInputProps}
            keyboardType={keyboardType}
            autoCapitalise="words"
            autoCorrect={false}
            style={[
              s.baseInputStyle,
              inputStyle,
              {
                borderBottomColor,
              },
            ]}
            underlineColorAndroid="transparent"
            placeholderTextColor="#788D99"
            placeholder={placeholder}
            value={value}
            onFocus={this._onFocus}
            onChangeText={this._onChange} />
        </View>
      </TouchableOpacity>
    );
  }
}
