import { applyURLParams } from "./config";

describe("applyURLParams", () => {
  const originalLocation = window.location;

  const mockWindowLocation = (newLocation: Location | URL) => {
    delete (window as any).location;
    window.location = newLocation as Location;
  };

  const setLocation = (url: string) => {
    mockWindowLocation(new URL(url));
  };

  const testConfig = (baseConfig: any, params: string) => {
    setLocation(`https://concord.org${params ? `?${params}` : ""}`);
    return applyURLParams(baseConfig);
  };

  afterEach(() => {
    mockWindowLocation(originalLocation);
  });

  it("should ignore URL params that don't exist in the base configuration", () => {
    expect(testConfig({foo: "bar"}, "abc=123")).toEqual({ foo: "bar" });
  });

  it("should set true for parameters without values", () => {
    expect(testConfig({foo: false}, "foo")).toEqual({ foo: true });
    expect(testConfig({foo: false}, "foo=")).toEqual({ foo: true });
  });

  it("should parse URL parameter values", () => {
    expect(testConfig({foo: false}, "foo=true")).toEqual({ foo: true });
    expect(testConfig({foo: false}, "foo=123")).toEqual({ foo: 123 });
    expect(testConfig({foo: false}, "foo=Infinity")).toEqual({ foo: Infinity });
    expect(testConfig({foo: false}, "foo=1,2,3,a")).toEqual({ foo: [1, 2, 3, "a"] });
  });

  it("should handle JSON as URL parameter values", () => {
    expect(testConfig({foo: false}, "foo={\"bar\": 1}")).toEqual({ foo: {bar: 1}});
  });

  it("should decode encoded characters in URL parameter values", () => {
    expect(testConfig({foo: false}, "foo=bar%20baz")).toEqual({ foo: "bar baz"});
    expect(testConfig({foo: false}, "foo=bar+baz")).toEqual({ foo: "bar baz"});
  });

  it("should ignore hash parameters", () => {
    expect(testConfig({foo: false}, "bar=true#foo=true")).toEqual({ foo: false });
  });
});
