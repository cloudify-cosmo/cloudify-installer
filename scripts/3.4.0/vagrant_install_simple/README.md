


# Manager Blueprints

The manager blueprints have the following file name pattern

manager_<type>_<environment>_inputs.yaml


 * _type_ -
   * plain - simplest configuration
   * security - will enable security
   * ssl - will limit manager to be available only on ssl. security is enabled
 * _environment_ - currently we differentiate between environment by username.
   * vagrant - is for local virtualbox execution
   * centos - for amazon ec2 execution
